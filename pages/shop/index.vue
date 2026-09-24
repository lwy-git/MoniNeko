<template>
	<view class="page-shop">
		<view class="header">
			<view class="header-back" @tap="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="page-title">装扮商店</text>
			<view class="fish-pill">
				<text class="fish-icon">🐟</text>
				<text class="fish-count">{{ catStore.fishCount }}</text>
			</view>
		</view>

		<scroll-view scroll-y class="shop-scroll">
			<view class="preview-card">
				<view class="preview-glow"></view>
				<cat-avatar
					:src="catStore.breedEmoji"
					:accessory="catStore.currentAccessory"
					size="preview"
				/>
				<text class="preview-name">{{ catStore.catName }}</text>
				<text class="preview-desc">
					{{ catStore.currentAccessoryInfo ? `正在佩戴：${catStore.currentAccessoryInfo.label}` : '挑一件喜欢的装扮吧喵~' }}
				</text>
				<view v-if="catStore.currentAccessory" class="remove-btn" @tap="removeAccessory">
					<text class="remove-btn-text">卸下装扮</text>
				</view>
			</view>

			<view class="section-heading">
				<view>
					<text class="section-title">猫咪衣橱</text>
					<text class="section-subtitle">完成任务赚鱼干，解锁更多装扮</text>
				</view>
				<text class="owned-count">已拥有 {{ catStore.ownedAccessories.length }}/{{ accessories.length }}</text>
			</view>

			<view class="product-grid">
				<view
					v-for="item in accessories"
					:key="item.key"
					:class="['product-card', { 'product-equipped': isEquipped(item), 'product-locked': isLevelLocked(item) }]"
				>
					<view class="product-visual">
						<text class="product-icon">{{ item.icon }}</text>
						<view v-if="isEquipped(item)" class="equipped-badge">
							<text class="equipped-badge-text">佩戴中</text>
						</view>
						<view v-else-if="isLevelLocked(item)" class="lock-badge">
							<text class="lock-badge-text">Lv.{{ item.unlockLevel }}</text>
						</view>
					</view>
					<text class="product-name">{{ item.label }}</text>
					<text class="product-desc">{{ item.description }}</text>
					<view class="product-footer">
						<view class="price-wrap">
							<text v-if="!isOwned(item)" class="price-text">🐟 {{ item.price }}</text>
							<text v-else class="owned-text">已拥有</text>
						</view>
						<view :class="['action-btn', actionClass(item)]" @tap="handleAccessory(item)">
							<text class="action-btn-text">{{ actionText(item) }}</text>
						</view>
					</view>
				</view>
			</view>

			<view class="shop-tip">
				<text class="shop-tip-icon">💡</text>
				<text class="shop-tip-text">购买装扮只消耗可用鱼干，不影响猫咪已经获得的等级。</text>
			</view>
		</scroll-view>
	</view>
</template>

<script setup>
import { onShow } from '@dcloudio/uni-app'
import { CAT_ACCESSORIES } from '@/config/constants.js'
import { useCatStore } from '@/store/cat-store.js'
import { useUserStore } from '@/store/user-store.js'

const catStore = useCatStore()
const userStore = useUserStore()
const accessories = CAT_ACCESSORIES

onShow(async () => {
	await catStore.fetchCatStatus(userStore.userId)
})

function isOwned(item) {
	return catStore.ownedAccessories.some(record => record.accessory_key === item.key)
}

function isEquipped(item) {
	return catStore.currentAccessory === item.key
}

function isLevelLocked(item) {
	return catStore.level < item.unlockLevel
}

function actionText(item) {
	if (isEquipped(item)) return '已穿戴'
	if (isOwned(item)) return '穿戴'
	if (isLevelLocked(item)) return '未解锁'
	return '购买'
}

function actionClass(item) {
	if (isEquipped(item) || isLevelLocked(item)) return 'action-disabled'
	if (isOwned(item)) return 'action-equip'
	return 'action-buy'
}

async function handleAccessory(item) {
	if (isEquipped(item)) return
	if (isLevelLocked(item)) {
		uni.showToast({ title: `猫咪达到 Lv.${item.unlockLevel} 后解锁`, icon: 'none' })
		return
	}
	if (isOwned(item)) {
		await equip(item.key)
		return
	}
	if (catStore.fishCount < item.price) {
		uni.showToast({ title: `还差 ${item.price - catStore.fishCount} 条小鱼干`, icon: 'none' })
		return
	}

	uni.showModal({
		title: '购买装扮',
		content: `使用 ${item.price} 条小鱼干购买“${item.label}”吗？`,
		confirmText: '购买',
		success: async (res) => {
			if (!res.confirm) return
			try {
				const result = await catStore.buyAccessory(userStore.userId, item)
				if (!result.success) {
					showPurchaseError(result.reason, item)
					return
				}
				await equip(item.key, false)
				uni.showToast({ title: '购买成功，已穿戴喵~', icon: 'none' })
			} catch (error) {
				uni.showToast({ title: '购买失败，请稍后重试', icon: 'none' })
			}
		}
	})
}

function showPurchaseError(reason, item) {
	const messages = {
		owned: '这件装扮已经拥有啦',
		fish_not_enough: '小鱼干不够喵~',
		level_locked: `猫咪达到 Lv.${item.unlockLevel} 后解锁`
	}
	uni.showToast({ title: messages[reason] || '暂时无法购买', icon: 'none' })
}

async function equip(accessoryKey, showToast = true) {
	const success = await catStore.equipAccessory(userStore.userId, accessoryKey)
	if (showToast) {
		uni.showToast({ title: success ? '装扮已穿戴喵~' : '穿戴失败', icon: 'none' })
	}
}

async function removeAccessory() {
	const success = await catStore.equipAccessory(userStore.userId, '')
	uni.showToast({ title: success ? '已卸下装扮' : '操作失败', icon: 'none' })
}

function goBack() {
	uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.page-shop {
	min-height: 100vh;
	background: var(--color-bg);
}

.header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 80rpx 24rpx 24rpx;
}

.header-back {
	width: 72rpx;
	height: 72rpx;
	background: var(--color-bg-card);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: var(--shadow-card);
}

.back-icon {
	font-size: 40rpx;
	color: var(--color-text-primary);
}

.page-title {
	font-size: 36rpx;
	font-weight: 800;
	color: var(--color-text-primary);
}

.fish-pill {
	min-width: 72rpx;
	height: 72rpx;
	padding: 0 18rpx;
	background: var(--color-bg-card);
	border-radius: var(--radius-full);
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 6rpx;
	box-shadow: var(--shadow-card);
}

.fish-icon,
.fish-count {
	font-size: 24rpx;
}

.fish-count {
	font-weight: 800;
	color: var(--color-text-primary);
}

.shop-scroll {
	height: calc(100vh - 176rpx);
}

.preview-card {
	position: relative;
	overflow: hidden;
	margin: 0 24rpx 36rpx;
	padding: 40rpx 24rpx 32rpx;
	background: linear-gradient(145deg, var(--color-primary-light), var(--color-bg-card));
	border-radius: var(--radius-lg);
	display: flex;
	flex-direction: column;
	align-items: center;
	box-shadow: var(--shadow-elevated);
}

.preview-glow {
	position: absolute;
	top: 30rpx;
	width: 240rpx;
	height: 240rpx;
	background: rgba(255, 255, 255, 0.55);
	border-radius: 50%;
}

.preview-name {
	position: relative;
	font-size: 34rpx;
	font-weight: 800;
	color: var(--color-text-primary);
	margin-top: 16rpx;
}

.preview-desc {
	position: relative;
	font-size: 22rpx;
	color: var(--color-text-secondary);
	margin-top: 4rpx;
}

.remove-btn {
	position: relative;
	margin-top: 20rpx;
	padding: 10rpx 24rpx;
	background: rgba(255, 255, 255, 0.7);
	border-radius: var(--radius-full);
}

.remove-btn-text {
	font-size: 22rpx;
	font-weight: 700;
	color: var(--color-text-secondary);
}

.section-heading {
	display: flex;
	align-items: flex-end;
	justify-content: space-between;
	padding: 0 32rpx;
	margin-bottom: 20rpx;
}

.section-title,
.section-subtitle {
	display: block;
}

.section-title {
	font-size: 32rpx;
	font-weight: 800;
	color: var(--color-text-primary);
}

.section-subtitle,
.owned-count {
	font-size: 20rpx;
	color: var(--color-text-muted);
}

.product-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 20rpx;
	padding: 0 24rpx;
}

.product-card {
	background: var(--color-bg-card);
	border-radius: 36rpx;
	padding: 22rpx;
	box-shadow: var(--shadow-card);
	border: 3rpx solid transparent;
}

.product-equipped {
	border-color: var(--color-primary);
}

.product-locked {
	opacity: 0.65;
}

.product-visual {
	position: relative;
	height: 164rpx;
	background: var(--color-bg-gray);
	border-radius: 28rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 16rpx;
}

.product-icon {
	font-size: 76rpx;
}

.equipped-badge,
.lock-badge {
	position: absolute;
	top: 10rpx;
	right: 10rpx;
	padding: 4rpx 12rpx;
	border-radius: var(--radius-full);
}

.equipped-badge {
	background: var(--color-primary);
}

.lock-badge {
	background: var(--color-text-muted);
}

.equipped-badge-text,
.lock-badge-text {
	font-size: 18rpx;
	font-weight: 700;
	color: #FFFFFF;
}

.product-name {
	display: block;
	font-size: 26rpx;
	font-weight: 800;
	color: var(--color-text-primary);
}

.product-desc {
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
	min-height: 62rpx;
	font-size: 20rpx;
	line-height: 1.5;
	color: var(--color-text-muted);
	margin-top: 6rpx;
}

.product-footer {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 10rpx;
	margin-top: 18rpx;
}

.price-text,
.owned-text {
	font-size: 21rpx;
	font-weight: 800;
}

.price-text {
	color: var(--color-warning);
}

.owned-text {
	color: var(--color-success);
}

.action-btn {
	min-width: 86rpx;
	padding: 10rpx 16rpx;
	border-radius: var(--radius-full);
	text-align: center;
}

.action-buy {
	background: var(--color-primary);
}

.action-equip {
	background: var(--color-paw-pink);
}

.action-disabled {
	background: var(--color-bg-gray);
}

.action-btn-text {
	font-size: 20rpx;
	font-weight: 800;
	color: #FFFFFF;
}

.action-disabled .action-btn-text {
	color: var(--color-text-muted);
}

.shop-tip {
	display: flex;
	align-items: flex-start;
	gap: 12rpx;
	margin: 28rpx 24rpx 60rpx;
	padding: 24rpx;
	background: rgba(246, 196, 69, 0.12);
	border-radius: 28rpx;
}

.shop-tip-icon {
	font-size: 24rpx;
}

.shop-tip-text {
	flex: 1;
	font-size: 21rpx;
	color: var(--color-text-secondary);
}
</style>
