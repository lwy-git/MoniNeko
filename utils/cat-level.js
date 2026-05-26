import { CAT_BREEDS } from '@/config/constants.js'

export function getLevelForFish(totalFish) {
	let level = 1
	while ((level) * 10 <= totalFish) {
		level++
	}
	return level
}

export function getFishForNextLevel(level) {
	return level * 10
}

export function getLevelProgress(totalFish) {
	const level = getLevelForFish(totalFish)
	const currentLevelFish = (level - 1) * 10
	const nextLevelFish = level * 10
	const current = totalFish - currentLevelFish
	const needed = nextLevelFish - currentLevelFish
	const percent = Math.min(100, Math.round((current / needed) * 100))
	return { level, current, needed, percent }
}

export function getUnlockedBreeds(level) {
	return CAT_BREEDS.filter(b => b.unlockLevel <= level)
}
