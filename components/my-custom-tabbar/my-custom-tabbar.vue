<template>
	<view class="tabbar-fixed-root">
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
					<image class="nav-icon" :src="item.icon"></image>
					<text class="nav-text">{{ item.text }}</text>
				</view>
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
	{ text: '首页', path: '/pages/home/index', icon: '/static/icons/tabbar/baimao.svg' },
	{ text: '统计', path: '/pages/stats/index', icon: '/static/icons/tabbar/buoumao.svg' },
	{ text: '记账', path: '/pages/add/index', icon: '/static/icons/tabbar/sanhuamao.svg' },
	{ text: '明细', path: '/pages/detail/index', icon: '/static/icons/tabbar/jumao.svg' },
	{ text: '我的', path: '/pages/profile/index', icon: '/static/icons/tabbar/lanmao.svg' }
]

function switchTab(index) {
	if (index === props.current) return
	uni.switchTab({ url: tabs[index].path })
}
</script>

<style lang="scss" scoped>
.tabbar-fixed-root {
	position: fixed !important;
	left: 0 !important;
	right: 0 !important;
	bottom: 0 !important;
	width: 100%;
	height: 140rpx;
	z-index: 99999;
	pointer-events: none;
	transform: translateZ(0);
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);
	background: #FFFFFF;
}

.tabbar {
	height: 140rpx;
	background: #FFFFFF;
	display: flex;
	justify-content: space-around;
	align-items: center;
	border-top: 1rpx solid #F3F4F6;
	box-sizing: border-box;
	pointer-events: auto;
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
}

/* 未选中颜色 */
.nav-text {
	font-size: 20rpx;
	margin-top: 2rpx;
	color: #9CA3AF;
}

/* 激活时文字变色 */
.tabbar-item.active .nav-text {
	color: #F6C445;
}

.nav-icon {
	width: 48rpx;
	height: 48rpx;
	margin-bottom: 6rpx;
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
