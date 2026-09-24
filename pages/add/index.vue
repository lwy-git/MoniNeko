<template>
	<view class="page-add">
		<view class="page-content anim-fade-in">
			<!-- 顶部：取消 / 支出收入切换 / 完成 -->
			<view class="header">
				<text class="cancel-btn" @tap="goBack">{{ isEditMode ? '返回' : '取消' }}</text>
				<view class="type-switch">
					<text :class="['type-item', { 'type-active': isExpense }]" @tap="isExpense = true">支出</text>
					<text :class="['type-item', { 'type-active': !isExpense }]" @tap="isExpense = false">收入</text>
				</view>
				<text class="done-btn" @tap="onSubmit">{{ isEditMode ? '保存' : '完成' }}</text>
			</view>

			<!-- 金额显示 -->
			<view class="amount-area">
				<text class="amount-label">输入金额</text>
				<text :class="['amount-display', { 'anim-shake': shaking }]">¥ {{ displayAmount }}</text>
			</view>

			<!-- 语音记账 -->
			<view v-if="!isEditMode" class="voice-entry" @tap="startVoiceAccounting">
				<view class="voice-entry-icon">
					<text class="voice-mic">🎙️</text>
				</view>
				<view class="voice-entry-info">
					<text class="voice-entry-title">语音记账</text>
					<text class="voice-entry-desc">试试说“早餐花了 8 块”</text>
				</view>
				<text class="voice-entry-action">点击说话</text>
			</view>

			<view v-if="voiceResult" class="voice-result-card">
				<view class="voice-result-header">
					<text class="voice-result-title">识别结果</text>
					<text class="voice-result-clear" @tap="clearVoiceResult">清除</text>
				</view>
				<text class="voice-result-text">“{{ voiceResult.text }}”</text>
				<view class="voice-result-tags">
					<text class="voice-result-tag">{{ voiceResult.type === 'income' ? '收入' : '支出' }}</text>
					<text class="voice-result-tag">{{ voiceCategoryLabel }}</text>
					<text :class="['voice-result-tag', { 'voice-result-warning': !voiceResult.amount }]">
						{{ voiceResult.amount ? `¥${voiceResult.amount.toFixed(2)}` : '请补充金额' }}
					</text>
				</view>
			</view>

			<!-- 分类选择 -->
			<view class="category-grid">
				<view
					v-for="(cat, idx) in categories"
					:key="idx"
					:class="['category-item', { 'category-selected': selectedCategory === idx }]"
					@tap="selectedCategory = idx"
				>
					<view :class="['category-icon-wrap', { 'category-icon-selected': selectedCategory === idx }]">
						<text class="category-icon">{{ cat.icon }}</text>
					</view>
					<text :class="['category-name', { 'category-name-active': selectedCategory === idx }]">{{ cat.label }}</text>
				</view>
			</view>

			<!-- 备注输入 -->
			<view class="remark-row">
				<text class="remark-icon">📝</text>
				<input class="remark-input" v-model="remark" placeholder="写点备注喵..." />
			</view>

			<view v-if="!isEditMode" class="template-section">
				<view class="template-header">
					<text class="template-title">快捷模板</text>
					<text class="template-save" @tap="saveAsTemplate">保存当前为模板</text>
				</view>
				<scroll-view v-if="expenseStore.templates.length" scroll-x class="template-list">
					<view
						v-for="item in expenseStore.templates"
						:key="item.id"
						class="template-chip"
						@tap="applyTemplate(item)"
						@longpress="confirmRemoveTemplate(item)"
					>
						<text class="template-chip-name">{{ item.item_name }}</text>
						<text class="template-chip-amount">¥{{ Number(item.amount).toFixed(2) }}</text>
					</view>
				</scroll-view>
				<text v-else class="template-empty">填写金额与备注后即可保存常用模板</text>
			</view>

			<!-- 数字键盘 -->
			<view class="keyboard">
				<view class="keyboard-main">
					<view class="key-row">
						<text class="key" @tap="inputKey('1')">1</text>
						<text class="key" @tap="inputKey('2')">2</text>
						<text class="key" @tap="inputKey('3')">3</text>
					</view>
					<view class="key-row">
						<text class="key" @tap="inputKey('4')">4</text>
						<text class="key" @tap="inputKey('5')">5</text>
						<text class="key" @tap="inputKey('6')">6</text>
					</view>
					<view class="key-row">
						<text class="key" @tap="inputKey('7')">7</text>
						<text class="key" @tap="inputKey('8')">8</text>
						<text class="key" @tap="inputKey('9')">9</text>
					</view>
					<view class="key-row">
						<text class="key" @tap="inputKey('.')">.</text>
						<text class="key key-zero" @tap="inputKey('0')">0</text>
						<text class="key key-delete" @tap="onDelete">⌫</text>
					</view>
				</view>
				<view class="keyboard-side">
					<text class="key-confirm" @tap="onSubmit">记账\n喵~</text>
				</view>
			</view>
		</view>

		<view v-if="isListening" class="voice-overlay">
			<view class="voice-dialog">
				<view class="voice-wave">
					<text v-for="index in 5" :key="index" :class="['voice-wave-bar', `voice-wave-bar-${index}`]"></text>
				</view>
				<text class="voice-listening-title">正在听你说...</text>
				<text class="voice-listening-tip">说完后稍等一下，将自动识别并回填</text>
				<view class="voice-cancel-btn" @tap="cancelVoiceAccounting">
					<text class="voice-cancel-text">取消</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { onShow, onHide } from '@dcloudio/uni-app'
import { useExpenseStore } from '@/store/expense-store.js'
import { useUserStore } from '@/store/user-store.js'
import { useVoiceRecognition } from '@/hooks/use-voice-recognition.js'
import { CATEGORIES, INCOME_CATEGORIES } from '@/config/constants.js'
import { getToday, getCurrentTime } from '@/utils/helpers.js'
import { parseVoiceExpense } from '@/utils/voice-expense-parser.js'

const expenseStore = useExpenseStore()
const userStore = useUserStore()
const { isListening, startListening, cancelListening } = useVoiceRecognition()

const isExpense = ref(true)
const selectedCategory = ref(0)
const amountStr = ref('')
const remark = ref('')
const shaking = ref(false)
const expenseDate = ref(getToday())
const returnToDateDetail = ref(false)
const voiceResult = ref(null)
const isEditMode = computed(() => !!expenseStore.editingRecord)

const categories = computed(() => isExpense.value ? CATEGORIES : INCOME_CATEGORIES)

const voiceCategoryLabel = computed(() => {
	if (!voiceResult.value) return ''
	const list = voiceResult.value.type === 'income' ? INCOME_CATEGORIES : CATEGORIES
	return list.find(item => item.key === voiceResult.value.category)?.label || '其他'
})

watch(isExpense, () => {
	selectedCategory.value = 0
}, { flush: 'sync' })

onShow(async () => {
	voiceResult.value = null
	const record = expenseStore.editingRecord
	if (record) {
		returnToDateDetail.value = false
		isExpense.value = record.type !== 'income'
		amountStr.value = String(record.amount)
		remark.value = record.remark || ''
		const catList = record.type === 'income' ? INCOME_CATEGORIES : CATEGORIES
		const catIdx = catList.findIndex(c => c.key === record.category)
		selectedCategory.value = catIdx >= 0 ? catIdx : 0
		expenseDate.value = record.expense_date || getToday()
	} else {
		const requestedDate = expenseStore.consumeExpenseDate()
		returnToDateDetail.value = !!requestedDate
		isExpense.value = true
		amountStr.value = ''
		remark.value = ''
		selectedCategory.value = 0
		expenseDate.value = requestedDate || getToday()
	}
	await expenseStore.fetchTemplates(userStore.userId)
})

onHide(() => {
	if (isListening.value) cancelListening()
})

const displayAmount = computed(() => {
	if (!amountStr.value) return '0.00'
	return amountStr.value
})

function inputKey(key) {
	if (key === '.' && amountStr.value.includes('.')) return
	if (amountStr.value.includes('.')) {
		const decimal = amountStr.value.split('.')[1]
		if (decimal && decimal.length >= 2) return
	}
	if (amountStr.value.length >= 10) return
	amountStr.value += key
}

function onDelete() {
	amountStr.value = amountStr.value.slice(0, -1)
}

async function startVoiceAccounting() {
	if (isListening.value) return
	try {
		const text = await startListening()
		if (!text) return
		applyVoiceResult(parseVoiceExpense(text))
	} catch (error) {
		if (error?.message === '已取消语音识别') return
		uni.showToast({ title: error?.message || '语音识别失败', icon: 'none', duration: 2500 })
	}
}

function applyVoiceResult(result) {
	voiceResult.value = result
	isExpense.value = result.type !== 'income'
	const list = result.type === 'income' ? INCOME_CATEGORIES : CATEGORIES
	const index = list.findIndex(item => item.key === result.category)
	selectedCategory.value = index >= 0 ? index : list.length - 1
	if (result.amount) amountStr.value = String(result.amount)
	if (result.remark) remark.value = result.remark
	uni.showToast({
		title: result.success ? '已识别，请确认后保存' : '没听清金额，请手动补充',
		icon: 'none',
		duration: 2200
	})
}

function cancelVoiceAccounting() {
	cancelListening()
}

function clearVoiceResult() {
	voiceResult.value = null
}

async function onSubmit() {
	const amount = parseFloat(amountStr.value)
	if (!amountStr.value || amount === 0) {
		shaking.value = true
		uni.showToast({ title: '请输入金额喵~', icon: 'none' })
		setTimeout(() => { shaking.value = false }, 500)
		return
	}

	const cat = categories.value[selectedCategory.value]

	try {
		if (isEditMode.value) {
			const updated = await expenseStore.editExpense(expenseStore.editingRecord.id, {
				type: isExpense.value ? 'expense' : 'income',
				category: cat.key,
				item_name: remark.value || cat.label,
				amount,
				remark: remark.value || ''
			})
			uni.showToast({ title: '修改成功喵~', icon: 'success' })
			expenseStore.clearEditingRecord()
			expenseStore.openDateDetail(updated.expense_date)
			setTimeout(() => { uni.switchTab({ url: '/pages/detail/index' }) }, 500)
		} else {
			const record = {
				user_id: userStore.userId,
				type: isExpense.value ? 'expense' : 'income',
				category: cat.key,
				item_name: remark.value || cat.label,
				amount,
				expense_date: expenseDate.value,
				expense_time: getCurrentTime(),
				remark: remark.value || ''
			}
			await expenseStore.createExpense(record)
			uni.showToast({ title: '记账成功喵~', icon: 'success' })
			amountStr.value = ''
			remark.value = ''
			selectedCategory.value = 0
			if (returnToDateDetail.value) {
				expenseStore.openDateDetail(expenseDate.value)
				setTimeout(() => { uni.switchTab({ url: '/pages/detail/index' }) }, 500)
			} else {
				setTimeout(() => { uni.switchTab({ url: '/pages/home/index' }) }, 500)
			}
		}
	} catch (e) {
		uni.showToast({ title: isEditMode.value ? '修改失败' : '记账失败', icon: 'none' })
	}
}

function applyTemplate(template) {
	isExpense.value = template.type !== 'income'
	amountStr.value = String(template.amount)
	remark.value = template.remark || template.item_name || ''
	const list = template.type === 'income' ? INCOME_CATEGORIES : CATEGORIES
	const index = list.findIndex(item => item.key === template.category)
	selectedCategory.value = index >= 0 ? index : 0
}

async function saveAsTemplate() {
	const amount = parseFloat(amountStr.value)
	if (!amount || amount <= 0) {
		uni.showToast({ title: '先填写模板金额喵~', icon: 'none' })
		return
	}
	const category = categories.value[selectedCategory.value]
	const itemName = remark.value.trim() || category.label
	const duplicate = expenseStore.templates.some(item => {
		return item.type === (isExpense.value ? 'expense' : 'income') &&
			item.category === category.key &&
			item.item_name === itemName &&
			Number(item.amount) === amount
	})
	if (duplicate) {
		uni.showToast({ title: '这个模板已经保存过啦', icon: 'none' })
		return
	}
	try {
		await expenseStore.createTemplate({
			user_id: userStore.userId,
			type: isExpense.value ? 'expense' : 'income',
			category: category.key,
			item_name: itemName,
			amount,
			expense_date: getToday(),
			expense_time: getCurrentTime(),
			remark: remark.value.trim()
		})
		uni.showToast({ title: '模板已保存喵~', icon: 'success' })
	} catch (e) {
		uni.showToast({ title: '模板保存失败', icon: 'none' })
	}
}

function confirmRemoveTemplate(template) {
	uni.showModal({
		title: '删除模板',
		content: `确定删除“${template.item_name}”吗？`,
		success: async (res) => {
			if (!res.confirm) return
			await expenseStore.removeTemplate(template.id)
			uni.showToast({ title: '模板已删除', icon: 'none' })
		}
	})
}

function goBack() {
	if (isEditMode.value) {
		expenseStore.clearEditingRecord()
	}
	uni.switchTab({ url: '/pages/home/index' })
}
</script>

<style lang="scss" scoped>
.page-add {
	min-height: 100vh;
	background: var(--color-bg);
	display: flex;
	flex-direction: column;
}

.page-content {
	flex: 1;
	padding: 0 24rpx;
	display: flex;
	flex-direction: column;
}

.header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 80rpx 8rpx 24rpx;
}

.cancel-btn {
	font-size: 28rpx;
	color: var(--color-text-muted);
	font-weight: 600;
}

.done-btn {
	font-size: 28rpx;
	color: var(--color-primary);
	font-weight: 600;
}

.type-switch {
	display: flex;
	background: var(--color-bg-gray);
	border-radius: var(--radius-full);
	padding: 4rpx;
}

.type-item {
	padding: 12rpx 32rpx;
	font-size: 24rpx;
	font-weight: 700;
	color: var(--color-text-muted);
	border-radius: var(--radius-full);
}

.type-active {
	background: var(--color-bg-card);
	color: var(--color-text-primary);
	box-shadow: var(--shadow-card);
}

/* 金额显示 */
.amount-area {
	text-align: right;
	padding: 16rpx 8rpx 32rpx;
}

.amount-label {
	font-size: 22rpx;
	color: var(--color-text-muted);
}

.amount-display {
	display: block;
	font-size: 80rpx;
	font-weight: 800;
	color: var(--color-text-primary);
	margin-top: 8rpx;
}

/* 分类网格 */
.category-grid {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 24rpx;
	margin-bottom: 24rpx;
}

.category-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8rpx;
}

.category-icon-wrap {
	width: 96rpx;
	height: 96rpx;
	background: var(--color-bg-card);
	border-radius: 32rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: var(--shadow-card);
}

.category-icon-selected {
	border: 4rpx solid var(--color-primary);
}

.category-icon {
	font-size: 40rpx;
}

.category-name {
	font-size: 20rpx;
	font-weight: 700;
	color: var(--color-text-muted);
}

.category-name-active {
	color: var(--color-text-primary);
}

/* 备注 */
.remark-row {
	display: flex;
	align-items: center;
	background: var(--color-bg-card);
	border-radius: 32rpx;
	padding: 24rpx 32rpx;
	margin-bottom: 24rpx;
	gap: 16rpx;
}

.remark-icon {
	font-size: 28rpx;
}

.remark-input {
	flex: 1;
	font-size: 26rpx;
	color: var(--color-text-primary);
}

/* 语音记账 */
.voice-entry {
	display: flex;
	align-items: center;
	gap: 16rpx;
	padding: 18rpx 22rpx;
	margin-bottom: 24rpx;
	background: linear-gradient(135deg, rgba(244, 114, 182, 0.12), rgba(246, 196, 69, 0.15));
	border: 2rpx solid rgba(244, 114, 182, 0.18);
	border-radius: 28rpx;
}

.voice-entry-icon {
	width: 64rpx;
	height: 64rpx;
	background: var(--color-bg-card);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: var(--shadow-card);
}

.voice-mic {
	font-size: 30rpx;
}

.voice-entry-info {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.voice-entry-title {
	font-size: 25rpx;
	font-weight: 800;
	color: var(--color-text-primary);
}

.voice-entry-desc {
	font-size: 20rpx;
	color: var(--color-text-muted);
}

.voice-entry-action {
	font-size: 21rpx;
	font-weight: 800;
	color: var(--color-paw-pink);
}

.voice-result-card {
	padding: 20rpx 24rpx;
	margin: -8rpx 0 24rpx;
	background: var(--color-bg-card);
	border-radius: 28rpx;
	box-shadow: var(--shadow-card);
}

.voice-result-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.voice-result-title {
	font-size: 22rpx;
	font-weight: 800;
	color: var(--color-text-primary);
}

.voice-result-clear {
	font-size: 20rpx;
	color: var(--color-text-muted);
}

.voice-result-text {
	display: block;
	font-size: 23rpx;
	color: var(--color-text-secondary);
	margin-top: 8rpx;
}

.voice-result-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 10rpx;
	margin-top: 14rpx;
}

.voice-result-tag {
	padding: 5rpx 14rpx;
	background: rgba(52, 211, 153, 0.12);
	border-radius: var(--radius-full);
	font-size: 19rpx;
	font-weight: 700;
	color: var(--color-success);
}

.voice-result-warning {
	background: rgba(251, 146, 60, 0.12);
	color: var(--color-warning);
}

.voice-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 1000;
	background: rgba(74, 55, 40, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 48rpx;
}

.voice-dialog {
	width: 100%;
	padding: 56rpx 40rpx 40rpx;
	background: var(--color-bg-card);
	border-radius: var(--radius-lg);
	display: flex;
	flex-direction: column;
	align-items: center;
	box-shadow: var(--shadow-elevated);
}

.voice-wave {
	height: 100rpx;
	display: flex;
	align-items: center;
	gap: 12rpx;
}

.voice-wave-bar {
	width: 14rpx;
	height: 44rpx;
	background: var(--color-paw-pink);
	border-radius: var(--radius-full);
	animation: voice-wave 0.9s ease-in-out infinite;
}

.voice-wave-bar-2,
.voice-wave-bar-4 {
	animation-delay: 0.15s;
}

.voice-wave-bar-3 {
	animation-delay: 0.3s;
}

.voice-wave-bar-5 {
	animation-delay: 0.45s;
}

.voice-listening-title {
	font-size: 34rpx;
	font-weight: 800;
	color: var(--color-text-primary);
	margin-top: 18rpx;
}

.voice-listening-tip {
	font-size: 22rpx;
	color: var(--color-text-muted);
	margin-top: 8rpx;
	text-align: center;
}

.voice-cancel-btn {
	margin-top: 36rpx;
	padding: 16rpx 48rpx;
	background: var(--color-bg-gray);
	border-radius: var(--radius-full);
}

.voice-cancel-text {
	font-size: 24rpx;
	font-weight: 700;
	color: var(--color-text-secondary);
}

@keyframes voice-wave {
	0%, 100% { transform: scaleY(0.55); }
	50% { transform: scaleY(1.8); }
}

.template-section {
	margin-bottom: 8rpx;
}

.template-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 12rpx;
	padding: 0 8rpx;
}

.template-title {
	font-size: 24rpx;
	font-weight: 800;
	color: var(--color-text-primary);
}

.template-save {
	font-size: 22rpx;
	font-weight: 700;
	color: var(--color-primary);
}

.template-list {
	white-space: nowrap;
}

.template-chip {
	display: inline-flex;
	align-items: center;
	gap: 12rpx;
	padding: 14rpx 22rpx;
	margin-right: 12rpx;
	background: var(--color-bg-card);
	border-radius: var(--radius-full);
	box-shadow: var(--shadow-card);
}

.template-chip-name {
	font-size: 22rpx;
	font-weight: 700;
	color: var(--color-text-primary);
}

.template-chip-amount {
	font-size: 20rpx;
	color: var(--color-paw-pink);
}

.template-empty {
	display: block;
	font-size: 20rpx;
	color: var(--color-text-muted);
	padding: 8rpx;
}

/* 数字键盘 */
.keyboard {
	display: flex;
	gap: 12rpx;
	margin-top: 16rpx;
	padding-bottom: 32rpx;
	flex-shrink: 0;
}

.keyboard-main {
	flex: 3;
	display: flex;
	flex-direction: column;
	gap: 12rpx;
}

.key-row {
	display: flex;
	gap: 12rpx;
}

.key {
	flex: 1;
	height: 100rpx;
	background: var(--color-bg-card);
	border-radius: 24rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 36rpx;
	font-weight: 700;
	color: var(--color-text-primary);
}

.key-zero {
	flex: 1;
}

.key-delete {
	color: var(--color-text-muted);
	background: var(--color-bg-gray);
}

.keyboard-side {
	flex: 1;
	display: flex;
}

.key-confirm {
	flex: 1;
	background: var(--color-primary);
	border-radius: 24rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28rpx;
	font-weight: 700;
	color: #FFFFFF;
	white-space: pre-line;
	text-align: center;
}

.anim-shake {
	animation: shake 0.4s ease-in-out;
}

@keyframes shake {
	0%, 100% { transform: translateX(0); }
	25% { transform: translateX(-10rpx); }
	75% { transform: translateX(10rpx); }
}
</style>
