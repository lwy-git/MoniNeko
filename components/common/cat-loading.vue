<template>
	<view class="cat-loading">
		<view class="paw-container">
			<text class="paw paw-1">🐾</text>
			<text class="paw paw-2">🐾</text>
			<text class="paw paw-3">🐾</text>
		</view>
		<text v-if="text" class="loading-text">{{ text }}</text>
	</view>
</template>

<script setup>
defineProps({
	text: {
		type: String,
		default: '加载中喵...'
	}
})
</script>

<style lang="scss" scoped>
.cat-loading {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 32rpx;
}

.paw-container {
	display: flex;
	gap: 16rpx;
}

.paw {
	font-size: 40rpx;
	animation: pawBounce 1.2s ease-in-out infinite;
}

.paw-1 {
	animation-delay: 0s;
}

.paw-2 {
	animation-delay: 0.2s;
}

.paw-3 {
	animation-delay: 0.4s;
}

@keyframes pawBounce {
	0%, 100% {
		transform: translateY(0);
		opacity: 0.4;
	}
	50% {
		transform: translateY(-16rpx);
		opacity: 1;
	}
}

.loading-text {
	margin-top: 16rpx;
	font-size: 24rpx;
	color: var(--color-text-muted);
	font-weight: 600;
}
</style>
