<template>
	<view :class="['cat-avatar-view', `cat-avatar-${size}`]">
		<image class="cat-avatar-image" :src="src" mode="aspectFit"></image>
		<text v-if="accessoryInfo" class="cat-accessory-icon">{{ accessoryInfo.icon }}</text>
	</view>
</template>

<script setup>
import { computed } from 'vue'
import { CAT_ACCESSORIES } from '@/config/constants.js'

const props = defineProps({
	src: {
		type: String,
		required: true
	},
	accessory: {
		type: String,
		default: ''
	},
	size: {
		type: String,
		default: 'medium'
	}
})

const accessoryInfo = computed(() => {
	return CAT_ACCESSORIES.find(item => item.key === props.accessory) || null
})
</script>

<style lang="scss" scoped>
.cat-avatar-view {
	position: relative;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}

.cat-avatar-image {
	width: 100%;
	height: 100%;
}

.cat-accessory-icon {
	position: absolute;
	top: -18%;
	right: -22%;
	font-size: 46%;
	line-height: 1;
	filter: drop-shadow(0 4rpx 4rpx rgba(74, 55, 40, 0.18));
}

.cat-avatar-tiny {
	width: 36rpx;
	height: 36rpx;
}

.cat-avatar-small {
	width: 60rpx;
	height: 60rpx;
}

.cat-avatar-medium {
	width: 88rpx;
	height: 88rpx;
}

.cat-avatar-large {
	width: 120rpx;
	height: 120rpx;
}

.cat-avatar-preview {
	width: 180rpx;
	height: 180rpx;
}
</style>
