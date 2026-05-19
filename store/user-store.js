import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
	const userId = ref('')
	const accountType = ref('guest')
	const nickname = ref('铲屎官')
	const avatarUrl = ref('')
	const deviceId = ref('')
	const darkMode = ref(false)

	function initGuestUser() {
		let storedId = uni.getStorageSync('device_id')
		if (!storedId) {
			storedId = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
			uni.setStorageSync('device_id', storedId)
		}
		deviceId.value = storedId
		userId.value = storedId
		accountType.value = 'guest'

		const storedDark = uni.getStorageSync('dark_mode')
		if (storedDark !== '') {
			darkMode.value = storedDark
		}
	}

	function toggleDarkMode() {
		darkMode.value = !darkMode.value
		uni.setStorageSync('dark_mode', darkMode.value)
	}

	return {
		userId,
		accountType,
		nickname,
		avatarUrl,
		deviceId,
		darkMode,
		initGuestUser,
		toggleDarkMode
	}
})
