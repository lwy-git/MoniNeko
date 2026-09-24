import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useCat } from '@/hooks/use-cat.js'
import { useDailyTasks } from '@/hooks/use-daily-tasks.js'
import { useAchievementDetector } from '@/hooks/use-achievement-detector.js'
import { getLevelProgress, getUnlockedBreeds } from '@/utils/cat-level.js'
import { CAT_ACCESSORIES, CAT_BREED_EMOJI } from '@/config/constants.js'
import { getToday, getCurrentYearMonth } from '@/utils/helpers.js'

export const useCatStore = defineStore('cat', () => {
	const catName = ref('招财')
	const breed = ref('orange')
	const fishCount = ref(0)
	const totalFishEarned = ref(0)
	const level = ref(1)
	const currentAccessory = ref('')
	const ownedAccessories = ref([])
	const lastCheckinDate = ref('')
	const achievements = ref([])
	const dailyTasks = ref([])

	const {
		loadCatStatus,
		addFish,
		checkin,
		updateBreed,
		updateCatName,
		loadAchievements,
		loadOwnedAccessories,
		purchaseAccessory,
		updateAccessory
	} = useCat()
	const { loadDailyTasks, claimDailyTask } = useDailyTasks()
	const { checkAfterExpense, checkAfterBudget, checkUnderBudget } = useAchievementDetector()

	const canCheckin = computed(() => lastCheckinDate.value !== getToday())

	const levelProgress = computed(() => getLevelProgress(totalFishEarned.value))

	const unlockedBreeds = computed(() => getUnlockedBreeds(level.value))

	const breedEmoji = computed(() => CAT_BREED_EMOJI[breed.value] || '/static/icons/tabbar/jumao.svg')

	const currentAccessoryInfo = computed(() => {
		return CAT_ACCESSORIES.find(item => item.key === currentAccessory.value) || null
	})

	const spentFish = computed(() => {
		return ownedAccessories.value.reduce((sum, record) => {
			const accessory = CAT_ACCESSORIES.find(item => item.key === record.accessory_key)
			return sum + Number(record.purchase_price ?? accessory?.price ?? 0)
		}, 0)
	})

	function syncFishBalance(total) {
		totalFishEarned.value = Number(total) || 0
		fishCount.value = Math.max(0, totalFishEarned.value - spentFish.value)
	}

	async function fetchCatStatus(userId) {
		const [cat, accessories] = await Promise.all([
			loadCatStatus(userId),
			loadOwnedAccessories(userId)
		])
		ownedAccessories.value = accessories
		catName.value = cat.cat_name
		breed.value = cat.breed
		syncFishBalance(cat.current_fish)
		level.value = cat.current_level
		currentAccessory.value = cat.current_accessory
		lastCheckinDate.value = cat.last_checkin_date
	}

	async function earnFish(userId, count = 1) {
		const result = await addFish(userId, count)
		syncFishBalance(result.newFish)
		if (result.leveled) {
			level.value = result.newLevel
		}
		return result
	}

	async function doCheckin(userId) {
		const result = await checkin(userId)
		lastCheckinDate.value = result.date
		syncFishBalance(result.newFish)
		if (result.leveled) {
			level.value = result.newLevel
		}
	}

	async function changeBreed(userId, breedKey) {
		await updateBreed(userId, breedKey)
		breed.value = breedKey
	}

	async function renameCat(userId, name) {
		await updateCatName(userId, name)
		catName.value = name
	}

	async function fetchAchievements(userId) {
		achievements.value = await loadAchievements(userId)
	}

	async function fetchAccessories(userId) {
		ownedAccessories.value = await loadOwnedAccessories(userId)
		fishCount.value = Math.max(0, totalFishEarned.value - spentFish.value)
	}

	async function buyAccessory(userId, accessory) {
		if (level.value < accessory.unlockLevel) {
			return { success: false, reason: 'level_locked' }
		}
		if (fishCount.value < accessory.price) {
			return { success: false, reason: 'fish_not_enough' }
		}
		const result = await purchaseAccessory(userId, accessory.key, accessory.price)
		if (result.success) {
			ownedAccessories.value.push(result.accessory)
			fishCount.value = Math.max(0, totalFishEarned.value - spentFish.value)
		}
		return result
	}

	async function equipAccessory(userId, accessoryKey) {
		const updated = await updateAccessory(userId, accessoryKey)
		if (!updated) return false
		currentAccessory.value = accessoryKey
		return true
	}

	async function fetchDailyTasks(userId) {
		dailyTasks.value = await loadDailyTasks(userId)
	}

	async function claimTask(userId, taskKey) {
		const result = await claimDailyTask(userId, taskKey)
		if (!result.success) return result

		dailyTasks.value = result.tasks
		syncFishBalance(result.newFish)
		if (result.leveled) {
			level.value = result.newLevel
		}
		return result
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
		await fetchCatStatus(userId)
	}

	return {
		catName,
		breed,
		fishCount,
		totalFishEarned,
		level,
		currentAccessory,
		currentAccessoryInfo,
		ownedAccessories,
		lastCheckinDate,
		achievements,
		dailyTasks,
		canCheckin,
		levelProgress,
		unlockedBreeds,
		breedEmoji,
		fetchCatStatus,
		earnFish,
		doCheckin,
		changeBreed,
		renameCat,
		fetchAchievements,
		fetchAccessories,
		buyAccessory,
		equipAccessory,
		fetchDailyTasks,
		claimTask,
		checkAchievements
	}
})
