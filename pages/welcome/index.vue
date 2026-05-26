<template>
	<view class="page-welcome">
		<view class="welcome-top">
			<view class="welcome-illustration">
				<image class="welcome-cat-img" src="/static/icons/tabbar/jumao.svg" mode="aspectFit"></image>
			</view>
		</view>

		<view class="welcome-card">
			<view class="card-tabs">
				<text class="card-tab active">登录</text>
				<text class="card-tab">注册</text>
			</view>

			<view class="form-area">
				<view class="input-row">
					<text class="input-icon">📱</text>
					<input class="form-input" placeholder="输入手机号" type="number" disabled />
				</view>
				<view class="input-row">
					<text class="input-icon">🔒</text>
					<input class="form-input" placeholder="输入验证码" type="number" disabled />
				</view>

				<view class="login-btn disabled-btn">
					<text class="login-icon">🐾</text>
					<text class="login-text">猫爪登录（V1.1 开放）</text>
				</view>
			</view>

			<view class="guest-entry">
				<text class="guest-link" @tap="enterAsGuest">先以游客身份逛逛喵~</text>
			</view>
		</view>

		<view class="welcome-bottom">
			<view class="quick-entry-btn" @tap="enterAsGuest">
				<text class="quick-entry-text">立即体验</text>
			</view>
			<text class="privacy-tip">登录后可同步数据并解锁更多装扮</text>
		</view>
	</view>
</template>

<script setup>
import { useUserStore } from '@/store/user-store.js'

function enterAsGuest() {
	const userStore = useUserStore()
	userStore.initGuestUser()
	uni.setStorageSync('has_launched', true)
	uni.switchTab({ url: '/pages/home/index' })
}
</script>

<style lang="scss" scoped>
.page-welcome {
	min-height: 100vh;
	background: var(--color-bg);
	display: flex;
	flex-direction: column;
	padding: 0 48rpx;
}

.welcome-top {
	display: flex;
	justify-content: center;
	padding-top: 120rpx;
	padding-bottom: 48rpx;
}

.welcome-illustration {
	width: 320rpx;
	height: 320rpx;
	border-radius: 48rpx;
	background: linear-gradient(135deg, rgba(251, 146, 60, 0.1), rgba(246, 196, 69, 0.1));
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: var(--shadow-elevated);
}

.welcome-cat-img {
	width: 160rpx;
	height: 160rpx;
}

.welcome-card {
	background: var(--color-bg-card);
	border-radius: 64rpx;
	padding: 48rpx;
	box-shadow: var(--shadow-card);
	border: 2rpx solid rgba(246, 196, 69, 0.2);
}

.card-tabs {
	display: flex;
	border-bottom: 2rpx solid var(--color-bg-gray);
	margin-bottom: 40rpx;
}

.card-tab {
	flex: 1;
	text-align: center;
	padding-bottom: 20rpx;
	font-size: 32rpx;
	font-weight: 700;
	color: var(--color-text-muted);

	&.active {
		color: var(--color-primary);
		border-bottom: 4rpx solid var(--color-primary);
	}
}

.form-area {
	display: flex;
	flex-direction: column;
	gap: 24rpx;
}

.input-row {
	display: flex;
	align-items: center;
	background: var(--color-bg-gray);
	border-radius: 32rpx;
	padding: 24rpx 32rpx;
}

.input-icon {
	font-size: 36rpx;
	margin-right: 20rpx;
}

.form-input {
	flex: 1;
	font-size: 28rpx;
	color: var(--color-text-primary);
}

.login-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 12rpx;
	padding: 28rpx;
	border-radius: var(--radius-full);
	margin-top: 8rpx;
}

.disabled-btn {
	background: var(--color-bg-gray);
	opacity: 0.6;
}

.login-icon {
	font-size: 32rpx;
}

.login-text {
	font-size: 28rpx;
	font-weight: 700;
	color: var(--color-text-muted);
}

.guest-entry {
	margin-top: 40rpx;
	text-align: center;
}

.guest-link {
	font-size: 26rpx;
	color: var(--color-text-muted);
	text-decoration: underline;
}

.welcome-bottom {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-end;
	padding-bottom: 80rpx;
}

.quick-entry-btn {
	width: 100%;
	padding: 32rpx;
	background: var(--color-paw-pink);
	border-radius: var(--radius-full);
	text-align: center;
	box-shadow: 0 8rpx 24rpx rgba(244, 114, 182, 0.3);
}

.quick-entry-text {
	font-size: 32rpx;
	font-weight: 700;
	color: #FFFFFF;
}

.privacy-tip {
	margin-top: 20rpx;
	font-size: 22rpx;
	color: var(--color-text-muted);
}
</style>
