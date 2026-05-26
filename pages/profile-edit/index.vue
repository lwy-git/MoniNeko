<template>
	<view class="page-profile-edit">
		<view class="page-content anim-fade-in">
			<view class="header">
				<view class="header-back" @tap="goBack">
					<text class="back-icon">‹</text>
				</view>
				<text class="page-title">个人信息</text>
				<view class="header-placeholder"></view>
			</view>

			<view class="avatar-card">
				<view class="avatar-wrap">
					<image class="avatar-img" :src="catStore.breedEmoji" mode="aspectFit"></image>
				</view>
				<text class="avatar-title">{{ nickname || '铲屎官' }}</text>
				<text class="avatar-sub">游客模式 · 本地资料</text>
			</view>

			<view class="form-card">
				<view class="form-item">
					<text class="form-label">昵称</text>
					<input
						class="form-input"
						v-model="nickname"
						maxlength="12"
						placeholder="请输入昵称"
					/>
				</view>
				<view class="form-divider"></view>
				<view class="form-item">
					<text class="form-label">猫咪名字</text>
					<input
						class="form-input"
						v-model="catName"
						maxlength="12"
						placeholder="请输入猫咪名字"
					/>
				</view>
			</view>

			<view class="save-btn" @tap="onSave">
				<text class="save-btn-text">保存资料</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useUserStore } from '@/store/user-store.js'
import { useCatStore } from '@/store/cat-store.js'

const userStore = useUserStore()
const catStore = useCatStore()
const nickname = ref('')
const catName = ref('')

onShow(async () => {
	await catStore.fetchCatStatus(userStore.userId)
	nickname.value = userStore.nickname
	catName.value = catStore.catName
})

async function onSave() {
	const nextNickname = nickname.value.trim()
	const nextCatName = catName.value.trim()
	if (!nextNickname) {
		uni.showToast({ title: '请输入昵称', icon: 'none' })
		return
	}
	if (!nextCatName) {
		uni.showToast({ title: '请输入猫咪名字', icon: 'none' })
		return
	}

	userStore.updateNickname(nextNickname)
	await catStore.renameCat(userStore.userId, nextCatName)
	uni.showToast({ title: '保存成功喵~', icon: 'success' })
	setTimeout(() => {
		uni.navigateBack()
	}, 500)
}

function goBack() {
	uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.page-profile-edit {
	min-height: 100vh;
	background: var(--color-bg);
}

.page-content {
	min-height: 100vh;
	padding: 0 24rpx;
}

.header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 80rpx 8rpx 32rpx;
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

.header-placeholder {
	width: 72rpx;
}

.page-title {
	font-size: 36rpx;
	font-weight: 700;
	color: var(--color-text-primary);
}

.avatar-card {
	background: var(--color-bg-card);
	border-radius: 40rpx;
	padding: 40rpx;
	box-shadow: var(--shadow-card);
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 24rpx;
}

.avatar-wrap {
	width: 144rpx;
	height: 144rpx;
	background: rgba(246, 196, 69, 0.12);
	border-radius: 40rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 20rpx;
}

.avatar-img {
	width: 88rpx;
	height: 88rpx;
}

.avatar-title {
	font-size: 34rpx;
	font-weight: 800;
	color: var(--color-text-primary);
}

.avatar-sub {
	font-size: 22rpx;
	color: var(--color-text-muted);
	margin-top: 4rpx;
}

.form-card {
	background: var(--color-bg-card);
	border-radius: 40rpx;
	padding: 8rpx 32rpx;
	box-shadow: var(--shadow-card);
}

.form-item {
	display: flex;
	align-items: center;
	padding: 28rpx 0;
	gap: 24rpx;
}

.form-label {
	width: 140rpx;
	font-size: 28rpx;
	font-weight: 700;
	color: var(--color-text-primary);
}

.form-input {
	flex: 1;
	font-size: 28rpx;
	color: var(--color-text-primary);
	text-align: right;
}

.form-divider {
	height: 2rpx;
	background: var(--color-bg-gray);
}

.save-btn {
	margin-top: 40rpx;
	padding: 30rpx;
	border-radius: var(--radius-full);
	background: var(--color-primary);
	text-align: center;
	box-shadow: 0 8rpx 24rpx rgba(246, 196, 69, 0.3);
}

.save-btn-text {
	font-size: 30rpx;
	font-weight: 800;
	color: #FFFFFF;
}
</style>
