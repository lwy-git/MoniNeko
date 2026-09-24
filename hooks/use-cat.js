import { getDB } from '@/utils/db/index.js'
import { getToday } from '@/utils/helpers.js'
import { getLevelForFish } from '@/utils/cat-level.js'

export function useCat() {
	async function loadCatStatus(userId) {
		const db = getDB()
		const results = await db.query('cat_status', (row) => row.user_id === userId)
		if (results.length > 0) {
			return results[0]
		}
		const newCat = await db.insert('cat_status', {
			user_id: userId,
			cat_name: '招财',
			breed: 'orange',
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
			const newLevel = getLevelForFish(newFish)
			const leveled = newLevel > cat.current_level
			await db.update('cat_status', cat.id, {
				current_fish: newFish,
				current_level: newLevel
			})
			return { newFish, leveled, newLevel }
		}
		return { newFish: 0, leveled: false, newLevel: 1 }
	}

	async function checkin(userId) {
		const db = getDB()
		const today = getToday()
		const results = await db.query('cat_status', (row) => row.user_id === userId)
		if (results.length > 0) {
			await db.update('cat_status', results[0].id, { last_checkin_date: today })
		}
		const fishResult = await addFish(userId, 1)
		return { date: today, ...fishResult }
	}

	async function updateBreed(userId, breedKey) {
		const db = getDB()
		const results = await db.query('cat_status', (row) => row.user_id === userId)
		if (results.length > 0) {
			await db.update('cat_status', results[0].id, { breed: breedKey })
		}
	}

	async function updateCatName(userId, catName) {
		const db = getDB()
		const results = await db.query('cat_status', (row) => row.user_id === userId)
		if (results.length > 0) {
			return await db.update('cat_status', results[0].id, { cat_name: catName })
		}
		return null
	}

	async function getRecordStreak(userId) {
		const db = getDB()
		const records = await db.query('expense_record', (row) => {
			return row.user_id === userId && !row.is_template
		})
		const dates = [...new Set(records.map(r => r.expense_date))].sort((a, b) => b.localeCompare(a))
		if (dates.length === 0) return 0

		const today = getToday()
		let streak = 0
		let checkDate = new Date()

		if (dates[0] !== today) {
			checkDate.setDate(checkDate.getDate() - 1)
			const yesterdayStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`
			if (dates[0] !== yesterdayStr) return 0
		}

		for (let i = 0; i < 60; i++) {
			const dateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`
			if (dates.includes(dateStr)) {
				streak++
				checkDate.setDate(checkDate.getDate() - 1)
			} else {
				break
			}
		}
		return streak
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
		updateBreed,
		updateCatName,
		getRecordStreak,
		loadAchievements,
		unlockAchievement
	}
}
