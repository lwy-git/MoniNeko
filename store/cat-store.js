import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useCat } from '@/hooks/use-cat.js'
import { getToday } from '@/utils/helpers.js'

export const useCatStore = defineStore('cat', () => {
	const catName = ref('招财')
	const breed = ref('橘猫')
	const fishCount = ref(0)
	const level = ref(1)
	const currentAccessory = ref('')
	const lastCheckinDate = ref('')
	const achievements = ref([])

	const { loadCatStatus, addFish, checkin, loadAchievements, unlockAchievement } = useCat()

	const canCheckin = computed(() => lastCheckinDate.value !== getToday())

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
		fishCount.value = await addFish(userId, count)
	}

	async function doCheckin(userId) {
		lastCheckinDate.value = await checkin(userId)
		fishCount.value += 1
	}

	async function fetchAchievements(userId) {
		achievements.value = await loadAchievements(userId)
	}

	async function unlock(userId, achievementKey) {
		const record = await unlockAchievement(userId, achievementKey)
		if (record) achievements.value.push(record)
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
		fetchCatStatus,
		earnFish,
		doCheckin,
		fetchAchievements,
		unlock
	}
})
