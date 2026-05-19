import { getDB } from '@/utils/db/index.js'

export function useExpense() {
	async function loadByDate(userId, date) {
		const db = getDB()
		const results = await db.query('expense_record', (row) => {
			return row.user_id === userId && row.expense_date === date && !row.is_template
		})
		results.sort((a, b) => a.expense_time.localeCompare(b.expense_time))
		return results
	}

	async function loadByMonth(userId, yearMonth) {
		const db = getDB()
		const results = await db.query('expense_record', (row) => {
			return row.user_id === userId &&
				row.expense_date.startsWith(yearMonth) &&
				!row.is_template
		})
		results.sort((a, b) => {
			const dateCompare = b.expense_date.localeCompare(a.expense_date)
			if (dateCompare !== 0) return dateCompare
			return a.expense_time.localeCompare(b.expense_time)
		})
		return results
	}

	async function addExpense(record) {
		const db = getDB()
		const now = new Date().toISOString()
		return await db.insert('expense_record', {
			...record,
			is_template: record.is_template || 0,
			created_at: now
		})
	}

	async function deleteExpense(id) {
		const db = getDB()
		await db.delete('expense_record', id)
	}

	async function updateExpense(id, data) {
		const db = getDB()
		return await db.update('expense_record', id, data)
	}

	async function loadTemplates(userId) {
		const db = getDB()
		return await db.query('expense_record', (row) => {
			return row.user_id === userId && row.is_template === 1
		})
	}

	return {
		loadByDate,
		loadByMonth,
		addExpense,
		deleteExpense,
		updateExpense,
		loadTemplates
	}
}
