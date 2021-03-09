<template>
  <div class="indexContainer">
    <div class="index_top">
      <div class="content" v-show="address.userName">
        <div class="title">收货信息</div>
        <div class="item_list">
          <span class="item1">姓名</span>
          <span class="item2">{{ address.userName }}</span>
        </div>
        <div class="item_list">
          <span class="item1">联系方式</span>
          <span class="item2">{{ address.telNumber }}</span>
        </div>
        <div class="item_list">
          <span class="item1">收货地址</span>
          <span class="item2">{{
            address.provinceName +
            address.cityName +
            address.countyName +
            address.detailInfo
          }}</span>
        </div>
        <div class="item_list">
          <span class="item1">邮政编码</span>
          <span class="item2">{{ address.postalCode }}</span>
        </div>
        <div class="bottom"></div>
      </div>
    </div>
    <div class="index_bottom">
      <div class="cart_content">
        <div class="title">购物列表</div>
        <div class="item_content" v-for="(item, index) in cart" :key="index">
          <div class="item">
            <a href="javacript:" class="weui-media-box weui-media-box_appmsg">
              <a :href="'/pages/goods_detail/main?goods_id=' + item.goods_id">
                <div class="weui-media-box__hd">
                  <img
                    class="weui-media-box__thumb"
                    :src="item.goods_imgUrl[0]"
                    alt=""
                  />
                </div>
              </a>
              <div class="weui-media-box__bd">
                <h4 class="weui-media-box__title">
                  【<span style="color: red">￥{{ item.goods_price }}</span
                  >】{{ item.goods_name }}
                </h4>
                <div class="weui-media-box__desc">
                  <div class="cart_num_tool">
                    <view class="goods_num">数量：{{ item.goods_num }}</view>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
        <div v-show="!cart.length">
          <img src="../../../static/images/nothing1.png" alt="" />
        </div>
      </div>
    </div>
    <!-- 底部工具栏 -->
    <view class="footer_tool">
      <view class="total_price_wrap">
        <view class="total_price">
          合计：
          <text class="total_price_text">￥{{ totalPrice }}</text>
        </view>
      </view>
      <view class="order_pay_wrap" @click="handlePay"
        >支付({{ totalNum }})</view
      >
    </view>
    <!-- <div class="order_content"></div> -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      address: {},
      cart: [],
      totalPrice: 0,
      totalNum: 0
    }
  },
  methods: {
    getOrderParma () {
      // 获取缓存数据
      const address = wx.getStorageSync('address')
      let cart = wx.getStorageSync('cart') || []
      // 过滤后的购物车数组
      cart = cart.filter((v) => v.isChecked)
      this.address = address
      this.cart = cart

      let totalNum = 0
      let totalPrice = 0
      cart.forEach((value) => {
        if (value.isChecked) {
          totalNum += value.goods_num
          totalPrice += value.goods_price * value.goods_num
        }
      })
      this.totalNum = totalNum
      this.totalPrice = totalPrice
    },
    // 支付事件实现
    handlePay () {
      const userInfos = wx.getStorageSync('userInfos')
      const address =
        this.address.provinceName +
        this.address.cityName +
        this.address.countyName +
        this.address.detailInfo
      let balance = userInfos.money - this.totalPrice
      if (balance < 0) {
        return wx.showToast({
          title: '余额不足!',
          icon: 'none',
          image: '',
          duration: 1500,
          mask: true
        })
      }
      wx.showModal({
        title: '支付确认',
        content: `余额: ￥${userInfos.money} - ￥${this.totalPrice} = ￥${balance}`,
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: async (result) => {
          if (result.confirm) {
            // 数据收集
            // seller_id,seller_name,goods_id,totalPrice,totalNum,goods_price,goods_name
            let formData = []
            this.cart.forEach((item) => {
              // let {seller_id, seller, goods_id, goods_price, goods_name, goods_num} = item
              let totalPrice = item.goods_num * item.goods_price
              let itemInfo = {
                seller_id: item.seller_id,
                seller_name: item.seller,
                goods_id: item.goods_id,
                goods_price: item.goods_price,
                goods_name: item.goods_name,
                totalNum: item.goods_num,
                totalPrice,
                buyer_name: userInfos.nickName,
                buyer_id: userInfos.openid,
                address
              }
              formData.push(itemInfo)
            })
            // 发送请求
            const { data } = await this.$fly.post('/order/create', {formData, totalPrice: this.totalPrice})
            if (data.meta.status !== 200) {
              return wx.showToast({
                title: '支付失败！',
                icon: 'error',
                image: '',
                duration: 2000,
                mask: true,
                success: (result) => {
                  setTimeout(() => {
                    wx.switchTab({
                      url: '/pages/cart/main'
                    })
                  }, 2000)
                }
              })
            }
            wx.showToast({
              title: '支付成功！',
              icon: 'success',
              image: '',
              duration: 2000,
              mask: true,
              success: (result) => {
                // 更新购物车和缓存数据
                userInfos.money = data.data.money
                this.cart = []
                wx.setStorageSync('userInfos', userInfos)
                wx.setStorageSync('cart', this.cart)
                setTimeout(() => {
                  wx.switchTab({
                    url: '/pages/cart/main'
                  })
                }, 2000)
              }
            })
          }
        },
        fail: (err) => {
          console.log(err)
        },
        complete: () => {}
      })
    }
  },
  onShow () {
    this.getOrderParma()
  }
}
</script>

<style lang="less">
.indexContainer {
  .index_top {
    // margin-bottom: 8rpx;
    padding: 10rpx;
    .btn {
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 10rpx;
      height: 100rpx;
      background-color: #469df8;
      margin-bottom: 8rpx;
      color: #fff;
      font-size: 35rpx;
      font-weight: 600;
      font-family: serif;
    }
    .content {
      padding: 8rpx;
      border: #66b1ff 1rpx solid;
      border-radius: 8rpx;
      background-color: #ecf5ff;
      .title {
        color: #66b1ff;
        margin-left: 10rpx;
        font-weight: 600;
        margin-bottom: 25rpx;
      }
      .item_list {
        margin-top: 2rpx;
        display: flex;
        border: #66b1ff 1rpx solid;
        border-radius: 10rpx 10rpx;
        flex-direction: row;
        justify-content: space-between;
        color: #66b1ff;
        .item1 {
          display: flex;
          flex: 1;
          background-color: #66b1ff;
          color: #fff;
          border-radius: 10rpx;
          align-items: center;
          justify-content: center;
        }
        .item2 {
          display: flex;
          flex: 4;
          align-items: center;
          justify-content: center;
          //   overflow: hidden;
        }
      }
      .bottom {
        margin-top: 25rpx;
      }
    }
  }
  .index_bottom {
    padding: 10rpx;
    margin-bottom: 110rpx;
    .cart_content {
      padding: 8rpx;
      border: #ebb563 1rpx solid;
      border-radius: 8rpx;
      background-color: #fdf6ec;
      .title {
        color: #ebb563;
        margin-left: 10rpx;
        font-weight: 600;
        margin-bottom: 25rpx;
      }
      .item_content {
        border-radius: 10rpx;
        background-color: #fff;
        border: #ebb563 1rpx solid;
        margin-bottom: 10rpx;
        .item {
          .weui-media-box__desc {
            margin-left: 20rpx;
            color: black;
            font-size: 32rpx;
          }
        }
      }
    }
  }
  .footer_tool {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 90rpx;
    background-color: #fff;
    display: flex;
    border-top: 1rpx solid #cccccc;
    .all_chk_wrap {
      flex: 2;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .total_price_wrap {
      flex: 5;
      padding-right: 15rpx;
      text-align: right;
      .total_price {
        .total_price_text {
          color: var(--themeColor);
          font-size: 34rpx;
          font-weight: 600;
        }
      }
    }
    .order_pay_wrap {
      flex: 3;
      background-color: var(--themeColor);
      color: #fff;
      font-size: 32rpx;
      font-weight: 600;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
