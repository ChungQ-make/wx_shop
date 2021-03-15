<template>
  <div class="indexContainer">
    <!-- 地址选择与显示区 -->
    <div class="index_top">
      <button class="btn" @click="handleChooseAdress">填写收货信息</button>
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
        <div class="item_list">
          <span class="item1">联系方式</span>
          <span class="item2">{{ address.telNumber }}</span>
        </div>
        <div class="bottom"></div>
      </div>
    </div>
    <!-- 购物车内容区 -->
    <div class="index_bottom">
      <div class="cart_content">
        <div class="title">购物列表</div>
        <div class="item_content" v-for="(item, index) in cart" :key="index">
          <div
            class="item"
            @longpress="deleteGoods(index)"
          >
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
                    <view class="numn_edit" @click="editGoodsNum(-1, index)">
                      -
                    </view>
                    <view class="goods_num">{{ item.goods_num }}</view>
                    <view class="numn_edit" @click="editGoodsNum(1, index)">
                      +
                    </view>
                  </div>
                </div>
              </div>
              <checkbox-group>
                <checkbox
                  :checked="item.isChecked"
                  @click="changeChecked(index)"
                ></checkbox>
              </checkbox-group>
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
      <view class="all_chk_wrap">
        <checkbox-group>
          <checkbox :checked="allChecked" @click="checkedAll"></checkbox>
        </checkbox-group>
      </view>
      <view class="total_price_wrap">
        <view class="total_price">
          合计：
          <text class="total_price_text">￥{{ totalPrice }}</text>
        </view>
      </view>
      <view class="order_pay_wrap" @click="handlePay"
        >结算({{ totalNum }})</view
      >
    </view>
  </div>
</template>

<script>
export default {
  data () {
    return {
      address: {},
      cart: [],
      totalPrice: 0,
      totalNum: 0,
      _allChecked: true
    }
  },
  methods: {
    //   获取地址信息
    handleChooseAdress () {
      wx.chooseAddress({
        success: (res) => {
          this.address = res
          wx.setStorageSync('address', res)
        }
      })
    },
    // 初始化获取缓存地址数据
    getAddress () {
      this.address = wx.getStorageSync('address')
    },
    // 修改商品数量
    editGoodsNum (num, index) {
      if (this.cart[index].goods_num + num <= 0) {
        wx.showModal({
          title: '',
          content: '是否删除该商品？',
          showCancel: true,
          cancelText: '取消',
          cancelColor: '#000000',
          confirmText: '确定',
          confirmColor: '#3CC51F',
          success: (result) => {
            if (result.confirm) {
              this.cart.splice(index, 1)
              this.totalChange()
            }
          }
        })
      } else {
        this.cart[index].goods_num += num
      }
      this.totalChange()
    },
    // 单个商品选中项改变
    changeChecked (index) {
      this.cart[index].isChecked = !this.cart[index].isChecked
      this.totalChange()
    },
    // 全选事件
    checkedAll () {
      // 这里由于不能修改计算属性的allChecked
      // 单独创建一个变量（_allChecked）来实现全选操作
      this._allChecked = !this.allChecked
      this.cart.forEach((item) => {
        item.isChecked = this._allChecked
      })
      this.totalChange()
    },
    // 支付功能事件实现
    handlePay () {
      const { address, totalNum } = this
      const userInfos = wx.getStorageSync('userInfos')
      if (!userInfos.openid) {
        return wx.showToast({
          title: '您还没有登陆！',
          icon: 'none',
          image: '',
          duration: 1500,
          mask: true
        })
      }
      if (!address.userName) {
        return wx.showToast({
          title: '您没有添加收货地址',
          icon: 'none',
          image: '',
          duration: 1500,
          mask: true
        })
      }

      if (totalNum === 0) {
        return wx.showToast({
          title: '您没有选购任何商品',
          icon: 'none',
          image: '',
          duration: 1500,
          mask: true
        })
      }
      // 跳转至支付界面
      wx.navigateTo({
        url: '/pages/pay/main'
      })
    },
    // 处理数据变动时导致总金额和总数量的事件(并修改缓存数据)
    totalChange () {
      let totalNum = 0
      let totalPrice = 0
      this.cart.forEach((value) => {
        if (value.isChecked) {
          totalNum += value.goods_num
          totalPrice += value.goods_price * value.goods_num
        }
      })
      this.totalNum = totalNum
      this.totalPrice = totalPrice
      wx.setStorageSync('cart', this.cart)
    },
    // 获取缓存中的购物车数据
    getCartData () {
      this.cart = wx.getStorageSync('cart')
      //   解决第一次使用产生的错误
      this.cart = this.cart ? this.cart : []
      this.totalChange()
    },
    // 长按删除事件
    deleteGoods (index) {
      wx.showModal({
        title: '',
        content: '是否删除该商品？',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: (result) => {
          if (result.confirm) {
            this.cart.splice(index, 1)
            this.totalChange()
          }
        },
        fail: () => {},
        complete: () => {}
      })
    }
  },
  computed: {
    allChecked: function () {
      // 全选选择框状态监听
      return !this.cart.some((item) => {
        return item.isChecked === false
      })
    }
  },
  onShow () {
    this.getAddress()
    this.getCartData()
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
      // padding: 8rpx;
      // border-radius: 10rpx;
      // background-color: #fdf6ec;
      // margin-top: 5rpx;
      // border: #ebb563 1rpx solid;
      // margin-bottom: 130rpx;
      // .title {
      //   margin-left: 10rpx;
      //   font-weight: 600;
      //   color: #ebb563;
      //   margin-bottom: 25rpx;
      //   border-radius: 8rpx;
      // }
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
          }
          .cart_num_tool {
            display: flex;
            .numn_edit {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 50rpx;
              height: 50rpx;
              border: #ebb563 1rpx solid;
              border-radius: 50%;
              background-color: #fff;
              color: #ebb563;
            }
            .goods_num {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 50rpx;
              height: 50rpx;
            }
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
