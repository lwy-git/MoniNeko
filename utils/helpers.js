export function formatMoney(amount) {
	return `¥${Number(amount).toFixed(2)}`
}

export function formatMoneyShort(amount) {
	if (amount >= 10000) {
		return `¥${(amount / 10000).toFixed(1)}万`
	}
	return `¥${Number(amount).toFixed(0)}`
}

export function getCurrentYearMonth() {
	const d = new Date()
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export function getToday() {
	return new Date().toISOString().slice(0, 10)
}

export function getCurrentTime() {
	const d = new Date()
	return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export function getRemainingDays() {
	const now = new Date()
	const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
	return lastDay - now.getDate() + 1
}

export function getDaysInMonth(year, month) {
	return new Date(year, month, 0).getDate()
}

export function getWeekDay(dateStr) {
	const days = ['日', '一', '二', '三', '四', '五', '六']
	const d = new Date(dateStr)
	return days[d.getDay()]
}

export function generateDeviceId() {
	return `device_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}
