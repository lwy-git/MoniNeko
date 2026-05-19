import { getDB } from '@/utils/db/index.js'
import { getCurrentYearMonth } from '@/utils/helpers.js'

export function useBudget() {
	async function loadBudgetByMonth(userId, yearMonth) {
		const db = getDB()
		const results = await db.query('monthly_budget', (row) => {
			return row.user_id === userId && row.year_month === yearMonth
		})
		return results.length > 0 ? results[0] : null
	}

	async function loadCurrentMonthBudget(userId) {
		return loadBudgetByMonth(userId, getCurrentYearMonth())
	}

	async function createBudget(userId, yearMonth, amount) {
		const db = getDB()
		const now = new Date().toISOString()
		return await db.insert('monthly_budget', {
			user_id: userId,
			year_month: yearMonth,
			budget_amount: amount,
			created_at: now,
			updated_at: now
		})
	}

	async function updateBudget(id, amount) {
		const db = getDB()
		const now = new Date().toISOString()
		return await db.update('monthly_budget', id, {
			budget_amount: amount,
			updated_at: now
		})
	}

	return {
		loadBudgetByMonth,
		loadCurrentMonthBudget,
		createBudget,
		updateBudget
	}
}
