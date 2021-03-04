<template>
    <view class="tabs">
        <view class="tabs_title">
            <view :class="item.isActive?'title_item active':'title_item'"
             v-for="(item, index) in tabs" :key="index" @click="handTabItem(index)">
                {{item.value}}
                <!-- 测试数据 -->
            </view>
        </view>
        <view class="tabs_content">
            <slot></slot>
        </view>
    </view>
</template>
<script>
export default {
  props: {
    tabs: {
      type: Array,
      value: []
    }
  },
  methods: {
    handTabItem (index) {
      this.$emit('event1', index)
    }
  }
}
</script>

<style lang="less">
.tabs{
    .tabs_title{
        display: flex;
        
    }
    .title_item{
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1;
        padding: 15rpx 0;
    }
    .active{
        color: #469DF8;
        border-bottom: 5rpx solid currentColor;
    }
}
</style>
