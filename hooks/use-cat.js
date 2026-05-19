import { getDB } from '@/utils/db/index.js'
import { getToday } from '@/utils/helpers.js'

export function useCat() {
	async function loadCatStatus(userId) {
		const db = getDB()
		const results = await db.query('cat_status', (row) => row.user_id === userId)
		if (results.length > 0) {
			return results[0]
		}
		// 首次使用，创建默认猫咪
		const newCat = await db.insert('cat_status', {
			user_id: userId,
			cat_name: '招财',
			breed: '橘猫',
			current_fish: 0,
			current_level: 1,
			current_accessory: '',
			last_checkin_date: ''
		})
		return newCat
	}

	async function addFish(userId, count = 1) {
		const db = getDB()
		const results = await db.query('cat_status', (row) => row.user_id === userId)
		if (results.length > 0) {
			const cat = results[0]
			const newFish = cat.current_fish + count
			await db.update('cat_status', cat.id, { current_fish: newFish })
			return newFish
		}
		return 0
	}

	async function checkin(userId) {
		const db = getDB()
		const today = getToday()
		const results = await db.query('cat_status', (row) => row.user_id === userId)
		if (results.length > 0) {
			await db.update('cat_status', results[0].id, { last_checkin_date: today })
		}
		await addFish(userId, 1)
		return today
	}

	async function loadAchievements(userId) {
		const db = getDB()
		return await db.query('achievement', (row) => row.user_id === userId)
	}

	async function unlockAchievement(userId, achievementKey) {
		const db = getDB()
		const existing = await db.query('achievement', (row) => {
			return row.user_id === userId && row.achievement_key === achievementKey
		})
		if (existing.length > 0) return null
		const now = new Date().toISOString()
		return await db.insert('achievement', {
			user_id: userId,
			achievement_key: achievementKey,
			unlocked_at: now
		})
	}

	return {
		loadCatStatus,
		addFish,
		checkin,
		loadAchievements,
		unlockAchievement
	}
}
