import { DAILY_TASKS } from '@/config/constants.js'
import { getDB } from '@/utils/db/index.js'
import { getCurrentYearMonth, getDaysInMonth, getToday } from '@/utils/helpers.js'
import { useCat } from '@/hooks/use-cat.js'

const STORAGE_PREFIX = 'monineko_daily_task_claims_'

export function useDailyTasks() {
	const { addFish } = useCat()

	function getClaimStorageKey(userId, date = getToday()) {
		return `${STORAGE_PREFIX}${userId}_${date}`
	}

	function loadClaimedKeys(userId) {
		const stored = uni.getStorageSync(getClaimStorageKey(userId))
		return Array.isArray(stored) ? stored : []
	}

	function saveClaimedKeys(userId, keys) {
		uni.setStorageSync(getClaimStorageKey(userId), keys)
	}

	async function loadDailyTasks(userId) {
		const db = getDB()
		const today = getToday()
		const yearMonth = getCurrentYearMonth()
		const claimedKeys = loadClaimedKeys(userId)

		const todayRecords = await db.query('expense_record', (row) => {
			return row.user_id === userId &&
				row.expense_date === today &&
				!row.is_template
		})
		const monthBudgets = await db.query('monthly_budget', (row) => {
			return row.user_id === userId && row.year_month === yearMonth
		})

		const todayExpenseTotal = todayRecords
			.filter(row => row.type !== 'income')
			.reduce((sum, row) => sum + Number(row.amount), 0)
		const todayIncomeTotal = todayRecords
			.filter(row => row.type === 'income')
			.reduce((sum, row) => sum + Number(row.amount), 0)
		const budgetAmount = Number(monthBudgets[0]?.budget_amount || 0)
		const now = new Date()
		const dayBudget = budgetAmount > 0
			? budgetAmount / getDaysInMonth(now.getFullYear(), now.getMonth() + 1)
			: 0

		const completionMap = {
			daily_expense: todayExpenseTotal > 0,
			daily_income: todayIncomeTotal > 0,
			daily_budget: budgetAmount > 0,
			daily_under_budget: budgetAmount > 0 && todayExpenseTotal > 0 && todayExpenseTotal <= dayBudget
		}

		return DAILY_TASKS
			.filter(task => !claimedKeys.includes(task.key))
			.map(task => ({
				...task,
				completed: !!completionMap[task.key],
				claimed: false
			}))
	}

	async function claimDailyTask(userId, taskKey) {
		const tasks = await loadDailyTasks(userId)
		const task = tasks.find(item => item.key === taskKey)
		if (!task) {
			return { success: false, reason: 'claimed' }
		}
		if (!task.completed) {
			return { success: false, reason: 'incomplete' }
		}

		const claimedKeys = loadClaimedKeys(userId)
		if (!claimedKeys.includes(taskKey)) {
			saveClaimedKeys(userId, [...claimedKeys, taskKey])
		}

		const fishResult = await addFish(userId, task.fish)
		const nextTasks = await loadDailyTasks(userId)
		return {
			success: true,
			task,
			tasks: nextTasks,
			...fishResult
		}
	}

	return {
		loadDailyTasks,
		claimDailyTask
	}
}
