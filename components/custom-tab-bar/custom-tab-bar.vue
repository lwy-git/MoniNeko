<template>
	<view class="tabbar">
		<view
			v-for="(item, index) in tabs"
			:key="index"
			:class="['tabbar-item', { active: current === index }]"
			@tap="switchTab(index)"
		>
			<view v-if="index === 2" class="add-btn" hover-class="add-btn-pressed" :hover-stay-time="100">
				<text class="add-icon">+</text>
			</view>
			<view v-else class="nav-item">
				<text class="nav-icon">{{ item.icon }}</text>
				<text class="nav-text">{{ item.text }}</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { onMounted } from 'vue'

const props = defineProps({
	current: {
		type: Number,
		default: 0
	}
})

onMounted(() => {
	uni.hideTabBar({ fail() {} })
})

const tabs = [
	{ text: '首页', path: '/pages/home/index', icon: '📅' },
	{ text: '统计', path: '/pages/stats/index', icon: '📊' },
	{ text: '记账', path: '/pages/add/index', icon: '' },
	{ text: '明细', path: '/pages/detail/index', icon: '📋' },
	{ text: '我的', path: '/pages/profile/index', icon: '👤' }
]

function switchTab(index) {
	if (index === props.current) return
	uni.switchTab({ url: tabs[index].path })
}
</script>

<style lang="scss" scoped>
.tabbar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	height: 140rpx;
	background: #FFFFFF;
	display: flex;
	justify-content: space-around;
	align-items: center;
	border-top: 1rpx solid #F3F4F6;
	z-index: 999;
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);
}

.tabbar-item {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
}

.nav-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	color: #9CA3AF;
}

.tabbar-item.active .nav-item {
	color: #F6C445;
}

.nav-icon {
	font-size: 48rpx;
}

.nav-text {
	font-size: 20rpx;
	margin-top: 2rpx;
}

.add-btn {
	width: 112rpx;
	height: 112rpx;
	background: #F472B6;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: -70rpx;
	box-shadow: 0 8rpx 20rpx rgba(244, 114, 182, 0.4);
	border: 8rpx solid #FFFFFF;
	transition: transform 0.15s ease;
}

.add-btn-pressed {
	transform: scale(0.88);
	opacity: 0.85;
}

.add-icon {
	font-size: 60rpx;
	color: #FFFFFF;
	font-weight: 300;
	line-height: 1;
}
</style>
