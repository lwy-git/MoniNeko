import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useExpense } from '@/hooks/use-expense.js'

export const useExpenseStore = defineStore('expense', () => {
	const todayExpenses = ref([])
	const monthExpenses = ref([])
	const selectedDate = ref('')
	const { loadByDate, loadByMonth, addExpense, deleteExpense, updateExpense } = useExpense()

	const todayTotal = computed(() =>
		todayExpenses.value
			.filter(e => e.type !== 'income')
			.reduce((sum, e) => sum + e.amount, 0)
	)

	const monthTotal = computed(() =>
		monthExpenses.value
			.filter(e => e.type !== 'income')
			.reduce((sum, e) => sum + e.amount, 0)
	)

	async function fetchByDate(userId, date) {
		todayExpenses.value = await loadByDate(userId, date)
		selectedDate.value = date
	}

	async function fetchByMonth(userId, yearMonth) {
		monthExpenses.value = await loadByMonth(userId, yearMonth)
	}

	async function createExpense(record) {
		const newRecord = await addExpense(record)
		todayExpenses.value.push(newRecord)
		monthExpenses.value.push(newRecord)
		return newRecord
	}

	async function removeExpense(id) {
		await deleteExpense(id)
		todayExpenses.value = todayExpenses.value.filter(e => e.id !== id)
		monthExpenses.value = monthExpenses.value.filter(e => e.id !== id)
	}

	async function editExpense(id, data) {
		const updated = await updateExpense(id, data)
		const todayIdx = todayExpenses.value.findIndex(e => e.id === id)
		if (todayIdx >= 0) todayExpenses.value[todayIdx] = updated
		const monthIdx = monthExpenses.value.findIndex(e => e.id === id)
		if (monthIdx >= 0) monthExpenses.value[monthIdx] = updated
		return updated
	}

	return {
		todayExpenses,
		monthExpenses,
		selectedDate,
		todayTotal,
		monthTotal,
		fetchByDate,
		fetchByMonth,
		createExpense,
		removeExpense,
		editExpense
	}
})
