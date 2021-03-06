<template>
  <div class="collect_index">
    <a class="top" href="/pages/goods_list/main">
      <div>获取新的收藏</div>
    </a>
    <div class="bottom">
      <div class="item" v-for="(item, index) in collectInfos" :key="index" @longpress="deleteCollect(index)">
        <div class="weui-panel__bd">
          <a
            :href="'/pages/goods_detail/main?goods_id=' + item.goods_id"
            class="weui-media-box weui-media-box_appmsg"
          >
            <div class="weui-media-box__hd">
              <img
                class="weui-media-box__thumb"
                :src="item.goods_imgUrl[0]"
                alt=""
              />
            </div>
            <div class="weui-media-box__bd">
              <h4 class="weui-media-box__title">
                【<span style="color: red">￥{{ item.goods_price }}</span
                >】{{ item.goods_name }}
              </h4>
              <!-- <span style="right: 0;color: red;">{{ item.goods_price }}￥</span> -->
              <p class="weui-media-box__desc">{{ item.description }}</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      collectInfos: []
    }
  },
  methods: {
    getCollectInfos () {
      this.collectInfos = wx.getStorageSync('collect') || []
    },
    deleteCollect (index) {
      wx.showModal({
        title: '',
        content: '是否删除该收藏？',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: (result) => {
          if (result.confirm) {
            if (result.confirm) {
              this.collectInfos.splice(index, 1)
              wx.setStorageSync('collect', this.collectInfos)
            }
          }
        },
        fail: () => {},
        complete: () => {}
      })
    }
  },
  onShow () {
    this.getCollectInfos()
  }
}
</script>

<style lang="less">
.collect_index {
  padding: 10rpx;
  .top {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10rpx;
    // width: 100%;
    height: 100rpx;
    background-color: #469df8;
    margin-bottom: 8rpx;
    color: #fff;
    font-size: 35rpx;
    font-weight: 600;
    font-family: serif;
  }
  .bottom {
    border-radius: 10rpx;
    background-color: #469df8;
    padding: 10rpx;
    .item {
      border-radius: 10rpx;
    //   height: 150rpx;
      background-color: #fff;
      margin-bottom: 10rpx;
    }
  }
}
</style>
