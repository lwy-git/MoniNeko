<template>
	<view class="page-splash">
		<view class="splash-bg">
			<view class="glow-ring"></view>
			<view class="cat-face anim-float">
				<text class="cat-emoji">😺</text>
			</view>
		</view>
		<view class="splash-info">
			<text class="app-name">招财喵记账</text>
			<text class="app-slogan">让记账像撸猫一样治愈</text>
		</view>
		<view class="splash-bottom">
			<view class="paw-trail">
				<text class="paw paw-1">🐾</text>
				<text class="paw paw-2">🐾</text>
				<text class="paw paw-3">🐾</text>
			</view>
			<button class="start-btn" @click="goWelcome">
				<text class="start-btn-text">立即开始喵~</text>
			</button>
		</view>
	</view>
</template>

<script setup>
function goWelcome() {
	uni.redirectTo({ url: '/pages/welcome/index' })
}
</script>

<style lang="scss" scoped>
.page-splash {
	min-height: 100vh;
	background: linear-gradient(180deg, #F6C445 0%, #FBBF24 100%);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	position: relative;
}

.splash-bg {
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
}

.glow-ring {
	width: 320rpx;
	height: 320rpx;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.2);
	position: absolute;
	animation: ringPulse 2s ease-in-out infinite;
}

@keyframes ringPulse {
	0%, 100% {
		transform: scale(1);
		opacity: 0.3;
	}
	50% {
		transform: scale(1.15);
		opacity: 0.1;
	}
}

.cat-face {
	width: 256rpx;
	height: 256rpx;
	background: #FFFFFF;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 0 60rpx rgba(246, 196, 69, 0.6);
}

.cat-emoji {
	font-size: 120rpx;
}

.splash-info {
	margin-top: 64rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.app-name {
	font-size: 52rpx;
	font-weight: 800;
	color: #4A3728;
	letter-spacing: 8rpx;
}

.app-slogan {
	margin-top: 16rpx;
	font-size: 26rpx;
	color: rgba(74, 55, 40, 0.7);
	font-weight: 500;
}

.splash-bottom {
	position: absolute;
	bottom: 96rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.paw-trail {
	display: flex;
	gap: 16rpx;
	margin-bottom: 32rpx;
}

.paw {
	font-size: 36rpx;
	color: #4A3728;
	animation: pawBounce 1.2s ease-in-out infinite;
}

.paw-1 { animation-delay: 0s; }
.paw-2 { animation-delay: 0.15s; }
.paw-3 { animation-delay: 0.3s; }

@keyframes pawBounce {
	0%, 100% {
		transform: translateY(0);
		opacity: 0.4;
	}
	50% {
		transform: translateY(-12rpx);
		opacity: 1;
	}
}

.start-btn {
	padding: 20rpx 48rpx;
	background: #4A3728;
	border-radius: 999rpx;
	border: none;
	line-height: 1;

	&::after {
		border: none;
	}

	&:active {
		transform: scale(0.95);
		opacity: 0.9;
	}
}

.start-btn-text {
	font-size: 28rpx;
	color: #FFFFFF;
	font-weight: 700;
}
</style>
