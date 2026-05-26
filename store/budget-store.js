import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useBudget } from '@/hooks/use-budget.js'
import { useCatStore } from '@/store/cat-store.js'

export const useBudgetStore = defineStore('budget', () => {
	const currentBudget = ref(null)
	const { loadCurrentMonthBudget, loadBudgetByMonth, createBudget, updateBudget } = useBudget()

	const budgetAmount = computed(() => currentBudget.value?.budget_amount || 0)
	const hasBudget = computed(() => !!currentBudget.value)

	async function fetchCurrentBudget(userId) {
		currentBudget.value = await loadCurrentMonthBudget(userId)
	}

	async function fetchBudgetByMonth(userId, yearMonth) {
		currentBudget.value = await loadBudgetByMonth(userId, yearMonth)
	}

	async function setBudget(userId, yearMonth, amount) {
		const record = await createBudget(userId, yearMonth, amount)
		currentBudget.value = record

		const catStore = useCatStore()
		await catStore.checkAchievements(userId, 'budget')

		return record
	}

	async function modifyBudget(id, amount) {
		const record = await updateBudget(id, amount)
		currentBudget.value = record
		return record
	}

	return {
		currentBudget,
		budgetAmount,
		hasBudget,
		fetchCurrentBudget,
		fetchBudgetByMonth,
		setBudget,
		modifyBudget
	}
})
