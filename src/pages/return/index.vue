<template>
  <div class="index">
    <div class="title">长按管理用户订单,点击查看详情</div>
    <div
      class="box"
      v-for="(item, index) in orderList"
      :key="index"
      @longpress="longCheckItem(item.order_id, item.status,item.seller_id,item.buyer_id)"
    >
      <a :href="'/pages/_order_detail/main?order_id=' + item.order_id">
        <div class="item1">
          <div class="type">[编号]{{ item.order_id }}</div>
          <div class="type">({{ item.totalNum }}件){{ item.goods_name }}</div>
          <div class="type">[单价]￥{{ item.goods_price }}</div>
          <div class="type">[购买人]{{ item.buyer_name }}</div>
          <div class="type">{{ item.address }}</div>
          <div class="type">{{ item.telNumber }}</div>
          <div class="type">{{ item.created_time }}</div>
        </div>
      </a>
      <div class="item2">
        <div class="amount">{{ item.totalPrice }}元</div>
        <div class="state" :style="state[item.status].color">
          {{ state[item.status].text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      orderList: [],
      state: [
        {
          text: '待发货',
          color: 'color: #67C23A;'
        },
        {
          text: '已发货',
          color: 'color: #E6A23C;'
        },
        {
          text: '已收货',
          color: 'color: #606266;'
        },
        {
          text: '退货申请中',
          color: 'color: #9932CC;'
        },
        {
          text: '退货中',
          color: 'color: #F56C6C;'
        },
        {
          text: '退货完成',
          color: 'color: #909399;'
        }
      ]
    }
  },
  methods: {
    async getMyGoodsOrder () {
      const { openid } = wx.getStorageSync('userInfos')
      const { data } = await this.$fly.post('/order/myGoodsOrders', {
        seller_id: openid
      })
      //   console.log(data)
      this.orderList = data.data.filter((item) => {
        return item.status > 2
      })
      this.orderList.forEach((item, index) => {
        item.created_time = this.$moment(item.created_time).format(
          'YYYY-MM-DD HH:mm'
        )
      })
      this.orderList.sort((a, b) => {
        return a.status - b.status
      })
    },
    // 长按事件处理
    longCheckItem (orderID, status, sellerID, buyerID) {
      if (status === 3) {
        // 待发货状态 （0）--> 待收货状态（1）
        wx.showActionSheet({
          itemList: ['确认是否退货', '拒绝退货并返回至[待发货状态]', '拒绝退货并返回至[已发货状态]', '拒绝退货并返回至[已收货状态]'],
          success: (res) => {
            if (res.tapIndex === 0) {
              this.aggreeReturn(orderID)
            } else if (res.tapIndex === 1) {
              this.backResquest(orderID, 0)
            } else if (res.tapIndex === 2) {
              this.backResquest(orderID, 1)
            } else if (res.tapIndex === 3) {
              this.backResquest(orderID, 2)
            }
          }
        })
      } else if (status === 4) {
        // 待发货状态 （0）--> 待收货状态（1）
        wx.showActionSheet({
          itemList: ['确认完成退货流程'],
          success: (res) => {
            if (res.tapIndex === 0) {
              this.isReturnOK(orderID, sellerID, buyerID)
            }
          }
        })
      }
    },
    // 是否允许用户执行退货流程
    aggreeReturn (orderID) {
      wx.showModal({
        title: '确认允许退货？',
        content: '',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: async (result) => {
          if (result.confirm) {
            const {data} = await this.$fly.post('/order/agreeReturn', {order_id: orderID})
            if (data.meta.status !== 200) {
              return wx.showToast({
                title: '操作失败！请重试',
                icon: 'none',
                image: '',
                duration: 1500,
                mask: true
              })
            }
            this.getMyGoodsOrder()
          }
        }
      })
    },
    // 拒绝退货事件处理
    backResquest  (orderID, status) {
      wx.showModal({
        title: '确认拒绝该退货申请？',
        content: '',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: async (result) => {
          if (result.confirm) {
            const {data} = await this.$fly.post('/order/backReturn', {order_id: orderID, status})
            if (data.meta.status !== 200) {
              return wx.showToast({
                title: '操作失败！请重试',
                icon: 'none',
                image: '',
                duration: 1500,
                mask: true
              })
            }
            this.getMyGoodsOrder()
          }
        }
      })
    },
    // 商家确认货物无误 完成退货流程
    isReturnOK (orderID, sellerID, buyerID) {
      wx.showModal({
        title: '是否允许退货？',
        content: '',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: async (result) => {
          if (result.confirm) {
            const {data} = await this.$fly.post('/order/checkGoods',
              {order_id: orderID, seller_id: sellerID, buyer_id: buyerID})
            if (data.meta.status !== 200) {
              return wx.showToast({
                title: '操作失败！请重试',
                icon: 'none',
                image: '',
                duration: 1500,
                mask: true
              })
            }
            this.getMyGoodsOrder()
          }
        }
      })
    }
  },
  onShow () {
    this.getMyGoodsOrder()
  }
}
</script>

<style lang="less" scoped>
.index {
  padding: 10rpx;
  .title {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30rpx;
    font-family: serif;
    color: #fff;
    background-color: var(--themeColor);
    height: 70rpx;
    border-radius: 8rpx;
    margin-bottom: 10rpx;
  }
  .box {
    background-color: var(--themeColor);
    height: 460rpx;
    padding: 10rpx;
    border-radius: 8rpx;
    display: flex;
    margin-bottom: 12rpx;
    font-family: serif;
    .item1 {
      flex: 1;
      background-color: #fff;
      height: 100%;
      border-radius: 8rpx;
      padding: 8rpx;
      box-sizing: border-box;
      overflow: hidden;
      .type {
        overflow: hidden;
        // display: flex;
        // align-items: center;
        //   justify-content: center;
        height: 14%;
        background-color: #ecf5ff;
        margin-bottom: 2rpx;
        border-radius: 8rpx;
        color: var(--themeColor);
        font-weight: 600;
        width: 500rpx;
        font-size: 28rpx;
      }
    }
    .item2 {
      flex: 1;
      background-color: var(--themeColor);
      height: 100%;
      margin-left: 8rpx;
      display: flex;
      flex-direction: column;
      .amount {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8rpx;
        background-color: #fff;
        width: 100%;
        height: 50%;
        margin-bottom: 8rpx;
        color: var(--themeColor);
        font-weight: 600;
      }
      .state {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8rpx;
        background-color: #fff;
        width: 100%;
        height: 50%;
        font-weight: 600;
        font-size: 30rpx;
        // color: yellowgreen;
      }
    }
  }
}
</style>
