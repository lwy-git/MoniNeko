import { ref } from 'vue'

export function useVoiceRecognition() {
	const isListening = ref(false)
	const transcript = ref('')
	const errorMessage = ref('')
	let activeRecognition = null
	let activeReject = null
	let stopTimer = null

	function clearTimer() {
		if (!stopTimer) return
		clearTimeout(stopTimer)
		stopTimer = null
	}

	function resetState() {
		clearTimer()
		isListening.value = false
		activeRecognition = null
		activeReject = null
	}

	function requestAndroidAudioPermission() {
		return new Promise((resolve, reject) => {
			if (plus.os.name !== 'Android') {
				resolve()
				return
			}
			plus.android.requestPermissions(
				['android.permission.RECORD_AUDIO'],
				(result) => {
					if (result.deniedAlways?.length || result.deniedPresent?.length) {
						reject(new Error('请在系统设置中允许使用麦克风'))
						return
					}
					resolve()
				},
				() => reject(new Error('麦克风权限申请失败'))
			)
		})
	}

	async function startAppRecognition() {
		await requestAndroidAudioPermission()
		return await new Promise((resolve, reject) => {
			let timedOut = false
			activeReject = reject
			plus.speech.startRecognize(
				{
					lang: 'zh-cn',
					userInterface: false,
					continue: false
				},
				(result) => {
					const bestResult = Array.isArray(result) ? result[0] : result
					transcript.value = String(bestResult || '').trim()
					resetState()
					if (!transcript.value) {
						reject(new Error('没有听清，请再说一次'))
						return
					}
					resolve(transcript.value)
				},
				(error) => {
					resetState()
					const message = timedOut
						? '识别超时，请靠近麦克风再说一次'
						: (error?.message || '语音识别失败，请稍后重试')
					reject(new Error(message))
				}
			)
			stopTimer = setTimeout(() => {
				timedOut = true
				stopListening()
			}, 15000)
		})
	}

	function startWebRecognition() {
		return new Promise((resolve, reject) => {
			const SpeechRecognition = globalThis.SpeechRecognition || globalThis.webkitSpeechRecognition
			if (!SpeechRecognition) {
				reject(new Error('当前浏览器不支持语音识别，请使用 App 体验'))
				return
			}
			const recognition = new SpeechRecognition()
			let settled = false
			let timedOut = false
			activeRecognition = recognition
			activeReject = reject
			recognition.lang = 'zh-CN'
			recognition.continuous = false
			recognition.interimResults = false
			recognition.maxAlternatives = 1
			recognition.onresult = (event) => {
				settled = true
				transcript.value = event.results?.[0]?.[0]?.transcript?.trim() || ''
				resetState()
				if (!transcript.value) {
					reject(new Error('没有听清，请再说一次'))
					return
				}
				resolve(transcript.value)
			}
			recognition.onerror = (event) => {
				settled = true
				resetState()
				const messages = {
					'not-allowed': '请允许浏览器使用麦克风',
					'no-speech': '没有听到声音，请再说一次',
					network: '语音服务网络异常'
				}
				const message = timedOut
					? '识别超时，请靠近麦克风再说一次'
					: (messages[event.error] || '语音识别失败，请稍后重试')
				reject(new Error(message))
			}
			recognition.onend = () => {
				isListening.value = false
				clearTimer()
				if (!settled) {
					settled = true
					resetState()
					reject(new Error(timedOut ? '识别超时，请再说一次' : '没有听清，请再说一次'))
				}
			}
			recognition.start()
			stopTimer = setTimeout(() => {
				timedOut = true
				stopListening()
			}, 15000)
		})
	}

	async function startListening() {
		if (isListening.value) return null
		transcript.value = ''
		errorMessage.value = ''
		isListening.value = true
		try {
			let resultPromise = null
			// #ifdef APP-PLUS
			resultPromise = startAppRecognition()
			// #endif
			// #ifdef H5
			resultPromise = startWebRecognition()
			// #endif
			if (!resultPromise) {
				throw new Error('当前平台暂不支持语音识别，请使用 App 体验')
			}
			return await resultPromise
		} catch (error) {
			resetState()
			errorMessage.value = error?.message || '语音识别失败'
			throw error
		}
	}

	function stopListening() {
		if (!isListening.value) return
		clearTimer()
		// #ifdef APP-PLUS
		plus.speech.stopRecognize()
		// #endif
		// #ifdef H5
		activeRecognition?.stop()
		// #endif
	}

	function cancelListening() {
		if (!isListening.value) return
		clearTimer()
		const reject = activeReject
		activeReject = null
		isListening.value = false
		reject?.(new Error('已取消语音识别'))
		// #ifdef APP-PLUS
		plus.speech.stopRecognize()
		// #endif
		// #ifdef H5
		activeRecognition?.abort()
		// #endif
		resetState()
	}

	return {
		isListening,
		transcript,
		errorMessage,
		startListening,
		stopListening,
		cancelListening
	}
}
