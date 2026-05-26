import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useCat } from '@/hooks/use-cat.js'
import { useAchievementDetector } from '@/hooks/use-achievement-detector.js'
import { getLevelProgress, getUnlockedBreeds } from '@/utils/cat-level.js'
import { CAT_BREED_EMOJI } from '@/config/constants.js'
import { getToday, getCurrentYearMonth } from '@/utils/helpers.js'

export const useCatStore = defineStore('cat', () => {
	const catName = ref('招财')
	const breed = ref('orange')
	const fishCount = ref(0)
	const level = ref(1)
	const currentAccessory = ref('')
	const lastCheckinDate = ref('')
	const achievements = ref([])

	const { loadCatStatus, addFish, checkin, updateBreed, loadAchievements } = useCat()
	const { checkAfterExpense, checkAfterBudget, checkUnderBudget } = useAchievementDetector()

	const canCheckin = computed(() => lastCheckinDate.value !== getToday())

	const levelProgress = computed(() => getLevelProgress(fishCount.value))

	const unlockedBreeds = computed(() => getUnlockedBreeds(level.value))

	const breedEmoji = computed(() => CAT_BREED_EMOJI[breed.value] || '/static/icons/tabbar/jumao.svg')

	async function fetchCatStatus(userId) {
		const cat = await loadCatStatus(userId)
		catName.value = cat.cat_name
		breed.value = cat.breed
		fishCount.value = cat.current_fish
		level.value = cat.current_level
		currentAccessory.value = cat.current_accessory
		lastCheckinDate.value = cat.last_checkin_date
	}

	async function earnFish(userId, count = 1) {
		const result = await addFish(userId, count)
		fishCount.value = result.newFish
		if (result.leveled) {
			level.value = result.newLevel
		}
		return result
	}

	async function doCheckin(userId) {
		const result = await checkin(userId)
		lastCheckinDate.value = result.date
		fishCount.value = result.newFish
		if (result.leveled) {
			level.value = result.newLevel
		}
	}

	async function changeBreed(userId, breedKey) {
		await updateBreed(userId, breedKey)
		breed.value = breedKey
	}

	async function fetchAchievements(userId) {
		achievements.value = await loadAchievements(userId)
	}

	async function checkAchievements(userId, trigger) {
		if (trigger === 'expense') {
			await checkAfterExpense(userId)
		} else if (trigger === 'budget') {
			await checkAfterBudget(userId)
		} else if (trigger === 'month_end') {
			await checkUnderBudget(userId, getCurrentYearMonth())
		}
		achievements.value = await loadAchievements(userId)
		const cat = await loadCatStatus(userId)
		fishCount.value = cat.current_fish
		level.value = cat.current_level
	}

	return {
		catName,
		breed,
		fishCount,
		level,
		currentAccessory,
		lastCheckinDate,
		achievements,
		canCheckin,
		levelProgress,
		unlockedBreeds,
		breedEmoji,
		fetchCatStatus,
		earnFish,
		doCheckin,
		changeBreed,
		fetchAchievements,
		checkAchievements
	}
})
