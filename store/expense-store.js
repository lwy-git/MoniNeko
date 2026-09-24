import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useExpense } from '@/hooks/use-expense.js'
import { useCatStore } from '@/store/cat-store.js'

export const useExpenseStore = defineStore('expense', () => {
	const todayExpenses = ref([])
	const monthExpenses = ref([])
	const selectedDate = ref('')
	const pendingDetailDate = ref('')
	const pendingExpenseDate = ref('')
	const templates = ref([])
	const editingRecord = ref(null)
	const { loadByDate, loadByMonth, addExpense, deleteExpense, updateExpense, loadTemplates } = useExpense()

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

	async function fetchTemplates(userId) {
		templates.value = await loadTemplates(userId)
	}

	async function createExpense(record) {
		const newRecord = await addExpense(record)
		todayExpenses.value.push(newRecord)
		monthExpenses.value.push(newRecord)

		if (record.type !== 'income') {
			const catStore = useCatStore()
			await catStore.earnFish(record.user_id, 1)
			await catStore.checkAchievements(record.user_id, 'expense')
		}

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

	async function createTemplate(record) {
		const template = await addExpense({
			...record,
			is_template: 1
		})
		templates.value.push(template)
		return template
	}

	async function removeTemplate(id) {
		await deleteExpense(id)
		templates.value = templates.value.filter(item => item.id !== id)
	}

	function openDateDetail(date) {
		pendingDetailDate.value = date
	}

	function consumeDetailDate() {
		const date = pendingDetailDate.value
		pendingDetailDate.value = ''
		return date
	}

	function createForDate(date) {
		pendingExpenseDate.value = date
	}

	function consumeExpenseDate() {
		const date = pendingExpenseDate.value
		pendingExpenseDate.value = ''
		return date
	}

	function setEditingRecord(record) {
		editingRecord.value = record
	}

	function clearEditingRecord() {
		editingRecord.value = null
	}

	return {
		todayExpenses,
		monthExpenses,
		selectedDate,
		templates,
		editingRecord,
		todayTotal,
		monthTotal,
		fetchByDate,
		fetchByMonth,
		fetchTemplates,
		createExpense,
		createTemplate,
		removeExpense,
		removeTemplate,
		editExpense,
		openDateDetail,
		consumeDetailDate,
		createForDate,
		consumeExpenseDate,
		setEditingRecord,
		clearEditingRecord
	}
})
