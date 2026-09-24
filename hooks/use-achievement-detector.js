import { useCat } from '@/hooks/use-cat.js'
import { ACHIEVEMENTS } from '@/config/constants.js'
import { getDB } from '@/utils/db/index.js'
import { getCurrentYearMonth } from '@/utils/helpers.js'

export function useAchievementDetector() {
	const { unlockAchievement, addFish, getRecordStreak } = useCat()

	async function tryUnlock(userId, key) {
		const result = await unlockAchievement(userId, key)
		if (result) {
			const reward = ACHIEVEMENTS[key.toUpperCase()]?.fish || 0
			if (reward > 0) {
				await addFish(userId, reward)
			}
			return { unlocked: true, key, reward }
		}
		return null
	}

	async function checkAfterExpense(userId) {
		const db = getDB()
		const records = await db.query('expense_record', (r) => {
			return r.user_id === userId && r.type !== 'income' && !r.is_template
		})

		if (records.length === 1) {
			await tryUnlock(userId, 'first_expense')
		}

		const streak = await getRecordStreak(userId)
		if (streak >= 30) {
			await tryUnlock(userId, 'streak_30')
		} else if (streak >= 7) {
			await tryUnlock(userId, 'streak_7')
		} else if (streak >= 3) {
			await tryUnlock(userId, 'streak_3')
		}
	}

	async function checkAfterBudget(userId) {
		const db = getDB()
		const budgets = await db.query('monthly_budget', (r) => r.user_id === userId)
		if (budgets.length === 1) {
			await tryUnlock(userId, 'first_budget')
		}
	}

	async function checkUnderBudget(userId, yearMonth) {
		const db = getDB()
		const budgets = await db.query('monthly_budget', (r) =>
			r.user_id === userId && r.year_month === yearMonth
		)
		if (budgets.length === 0) return

		const budget = budgets[0].budget_amount
		const records = await db.query('expense_record', (r) =>
			r.user_id === userId &&
			r.expense_date.startsWith(yearMonth) &&
			r.type !== 'income' &&
			!r.is_template
		)
		const total = records.reduce((sum, r) => sum + r.amount, 0)
		if (total > 0 && total < budget) {
			await tryUnlock(userId, 'under_budget')
		}
	}

	return {
		checkAfterExpense,
		checkAfterBudget,
		checkUnderBudget
	}
}
