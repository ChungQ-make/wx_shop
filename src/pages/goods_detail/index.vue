<template>
  <view>
    <!-- 轮播图显示 -->
    <view class="detail_swiper">
      <swiper autoplay="true" circular="true" indicator-dots="true">
        <swiper-item
          v-for="(item, index) in goodsDetail.goods_imgUrl"
          :key="index"
          @click="handlePrevwImage"
        >
          <image mode="widthFix" :src="item" />
        </swiper-item>
      </swiper>
    </view>
    <!-- 基本信息栏 -->
    <view class="goods_price">￥{{ goodsDetail.goods_price }}</view>
    <view class="goods_name_row">
      <view class="goods_name"><span style="color: #ffa500;">{{goodsDetail.status!==0?'[暂停出售]':'[正常出售]'}}</span>{{ goodsDetail.goods_name }}</view>
      <view class="goods_collect" @click="handleCollect">
        <text
          :class="
            isCollect ? 'iconfont icon-shoucang' : 'iconfont icon-shoucang1'
          "
        ></text>
        <view class="goods_text">收藏</view>
      </view>
    </view>

    <!-- 图文详情 -->
    <view class="goods_info">
      <view class="goods_info_title">库存</view>
      <view class="goods_info_content">
        <view>{{ goodsDetail.stocks }}</view>
      </view>
    </view>
    <view class="goods_info">
      <view class="goods_info_title">商家</view>
      <view class="goods_info_content">
        <a href="javascript:">{{ goodsDetail.seller }}</a>
      </view>
    </view>
    <view class="goods_info">
      <view class="goods_info_title">上架时间</view>
      <view class="goods_info_content">
        <view>{{ goodsDetail.created_time }}</view>
      </view>
    </view>
    <view class="goods_info">
      <view class="goods_info_title">图文详情</view>
      <view class="goods_info_content">
        <rich-text :nodes="goodsDetail.description"></rich-text>
      </view>
    </view>

    <!-- 底部工具栏 -->
    <view class="btm_tool">
      <view class="tool_item">
        <view class="iconfont icon-kefu"></view>
        <view>联系客服</view>
        <button open-type="contact"></button>
      </view>
      <view class="tool_item">
        <view class="iconfont icon-fenxiang"></view>
        <view>分享</view>
        <button open-type="share"></button>
      </view>
      <navigator class="tool_item" url="/pages/cart/main" open-type="switchTab">
        <view class="iconfont icon-gouwuche"></view>
        <view>购物车</view>
      </navigator>
      <view class="tool_item btn_cart" @click="handleCartAdd">
        <view>加入购物车</view>
      </view>
      <view class="tool_item btn_buy" @click="pay">
        <view>立即购买</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data () {
    return {
      goodsDetail: {},
      isCollect: false
    }
  },
  methods: {
    //   接受参数获取详细信息
    async getGoodsDetail () {
      const goodsID = this.$root.$mp.query.goods_id
      const { data } = await this.$fly.get('/goods/detail', {
        goods_id: goodsID
      })
      this.goodsDetail = data.data
      this.goodsDetail.created_time = this.$moment(
        this.goodsDetail.created_time
      ).format('YYYY-MM-DD HH:mm')
      this.goodsDetail.goods_imgUrl.push(
        'http://localhost:5000/upload/img/catitems/goods_categories.png'
      )
      this.goodsDetail.goods_imgUrl.push('https://placeimg.com/640/480/any')
      this.isCollected()
    },
    // 图片预览放大
    handlePrevwImage (e) {
      // 构建预览图片上url数组
      const urls = this.goodsDetail.goods_imgUrl
      // 接受传递过来的url
      const current = e.currentTarget.dataset.url
      wx.previewImage({
        current,
        urls
      })
    },
    // 添加至购物车
    handleCartAdd () {
      // 获取缓存的购物车数据
      let cart = wx.getStorageSync('cart') || []
      //   判断是否存在该商品
      let index = cart.findIndex(
        (item) => item.goods_id === this.goodsDetail.goods_id
      )

      if (index === -1) {
        // 不存在 第一次加入
        this.goodsDetail.goods_num = 1
        // 添加选中框状态
        this.goodsDetail.isChecked = true
        cart.push(this.goodsDetail)
      } else {
        // 存在 num++
        cart[index].goods_num++
      }
      // 重新添加会缓存中
      wx.setStorageSync('cart', cart)
      // 弹窗提示
      wx.showToast({
        title: '添加成功',
        icon: 'success',
        mask: true
      })
    },
    // 添加收藏事件
    handleCollect () {
      let isCollect = false
      // 1 获取缓存中的商品收藏数组
      let collect = wx.getStorageSync('collect') || []
      // 2 判断该商品是否被收藏过
      let index = collect.findIndex(
        (item) => item.goods_id === this.goodsDetail.goods_id
      )
      // 3 当index！=-1表示 已经收藏过
      if (index !== -1) {
        // 能找到 已经收藏过了  在数组中删除该商品
        collect.splice(index, 1)
        isCollect = false
        wx.showToast({
          title: '取消成功',
          icon: 'success',
          mask: true
        })
      } else {
        // 没有收藏过
        collect.push(this.goodsDetail)
        isCollect = true
        wx.showToast({
          title: '收藏成功',
          icon: 'success',
          mask: true
        })
      }
      // 4 把数组存入到缓存中
      wx.setStorageSync('collect', collect)
      // 5 修改data中的属性  isCollect
      this.isCollect = isCollect
    },
    // 页面展示时 重新检查商品是否在收藏夹里
    isCollected () {
      let collect = wx.getStorageSync('collect')
      let index = collect.findIndex(
        (item) => item.goods_id === this.goodsDetail.goods_id
      )
      this.isCollect = index !== -1
    }
  },
  onShow () {
    this.getGoodsDetail()
    // 开启分享功能
    wx.showShareMenu({
      withShareTicket: false,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },
  onShareAppMessage: function () {
    // wx.showShareMenu({
    //   withShareTicket: true,
    //   menus: ['shareAppMessage', 'shareTimeline']
    // })
    return {
      title: '应科二手市场',
      path: '/pages/index/main',
      success: function (shareTickets) {
        console.info(shareTickets + '成功')
        // 转发成功
      },
      fail: function (res) {
        console.log(res + '失败')
        // 转发失败
      },
      complete: function (res) {
        // 不管成功失败都会执行
      }
    }
  },
  onShareTimeline: function () {
    return {
      title: this.goodsDetail.goods_name,
      query: `goods_id=${this.goodsDetail.goods_id}`,
      imageUrl: this.goodsDetail.goods_imgUrl
    }
  }
}
</script>

<style lang="less">
image {
  width: 100%;
}

page {
  padding-bottom: 90rpx;
}

.detail_swiper {
  swiper {
    margin-top: 20rpx;
    height: 65vw;
    text-align: center;
    image {
      width: 60%;
    }
  }
}

.goods_price {
  padding: 15rpx;
  font-style: 32rpx;
  font-weight: 600;
  color: red;
}

.goods_name_row {
  border-top: 5rpx solid #dedede;
  border-bottom: 5rpx solid #dedede;
  padding: 10rpx 0;
  display: flex;
  .goods_name {
    flex: 5;
    color: black;
    font-size: 30rpx;
    padding: 0 10rpx;
    font-weight: 600;
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .goods_collect {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-left: 1rpx solid #dedede;
  }
}

.goods_info {
  margin-top: 20rpx;
  border: #409eff 1rpx solid;
  padding: 6rpx;
  .goods_info_title {
    background-color: #409eff;
    font-size: 28rpx;
    color: #fff;
    font-weight: 600;
    padding: 10rpx;
  }
  // .goods_info_content{}
}

.btm_tool {
  border-top: 1rpx solid #cccccc;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 90rpx;
  background-color: #fff;
  display: flex;
  .tool_item {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 24rpx;
    position: relative;
    button {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
    }
  }
  .btn_cart {
    flex: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #ffa500;
    color: #fff;
    font-size: 30rpx;
    font-weight: 600;
  }
  .btn_buy {
    flex: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #eb4450;
    color: #fff;
    font-size: 30rpx;
    font-weight: 600;
  }
}
</style>
