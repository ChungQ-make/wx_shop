<template>
  <div class="index">
    <div class="title">长按确认收货或申请退货</div>
    <div
      class="box"
      v-for="(item, index) in orderList"
      :key="index"
      @longpress="item.status <= 3 && longCheckItem(item.order_id, item.status)"
    >
      <a :href="'/pages/order_detail/main?order_id=' + item.order_id">
        <div class="item1">
          <div class="type">({{ item.totalNum }}件){{ item.goods_name }}</div>
          <div class="type">￥{{ item.goods_price }}</div>
          <div class="type">{{ item.created_time }}</div>
        </div>
      </a>
      <div class="item2">
        <div class="amount">{{ item.totalPrice }}.0元</div>
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
      //   openid: '',
      state: [
        {
          text: '已支付',
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
      ],
      orderList: []
    }
  },
  methods: {
    getOrderList () {
      //   console.log(this.$root.$mp.query.type)
      let type = this.$root.$mp.query.type
      //   console.log(typeof JSON.parse(type))
      //   * 这里的type类型是字符串 需要进行类型转换
      type = type * 1
      if (type === 1) {
        this.getTypeOrder()
      } else if (type === 2) {
        this.getTypeOrder(0)
      } else if (type === 3) {
        this.getTypeOrder(1)
      } else if (type === 4) {
        this.getTypeOrder(4)
      }
    },
    // 长按弹出框
    longCheckItem (orderID, status) {
      if (status < 2) {
        wx.showActionSheet({
          itemList: ['确认收货', '申请退款'],
          success: (res) => {
          //   console.log(res.tapIndex)
            if (res.tapIndex === 0) {
              this.takeGoods(orderID)
            } else if (res.tapIndex === 1) {
              this.returnGoods(orderID)
            }
          }
        })
      } else if (status === 2) {
        wx.showActionSheet({
          itemList: ['申请退款'],
          success: (res) => {
            if (res.tapIndex === 0) {
              this.returnGoods(orderID)
            }
          }
        })
      }
    //   wx.showActionSheet({
    //     itemList: ['确认收货', '申请退款'],
    //     success: (res) => {
    //       //   console.log(res.tapIndex)
    //       if (res.tapIndex === 0) {
    //         if (status === 2) {
    //           return wx.showToast({
    //             title: '无法重复确认收货',
    //             icon: 'none',
    //             image: '',
    //             duration: 1500,
    //             mask: true
    //           })
    //         } else if (status > 2) {
    //           return wx.showToast({
    //             title: '当前订单无法确认收货，请联系商家或者管理员',
    //             icon: 'none',
    //             image: '',
    //             duration: 1500,
    //             mask: true
    //           })
    //         }
    //         this.takeGoods(orderID)
    //       } else if (res.tapIndex === 1) {
    //         if (status === 4) {
    //           return wx.showToast({
    //             title: '当前订单正在退货序列中',
    //             icon: 'none',
    //             image: '',
    //             duration: 1500,
    //             mask: true
    //           })
    //         } else if (status === 5) {
    //           return wx.showToast({
    //             title: '当前订单已完成退货操作',
    //             icon: 'none',
    //             image: '',
    //             duration: 1500,
    //             mask: true
    //           })
    //         }
    //         this.returnGoods(orderID)
    //       }
    //     }
    //   })
    },
    // 退货申请
    async returnGoods (orderID) {
      wx.showModal({
        title: '确认退款？',
        content: '',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: (result) => {
          if (result.confirm) {
          }
        }
      })
    },
    // 确认收货
    async takeGoods (orderID) {
      wx.showModal({
        title: '确认收货？',
        content: '',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: (result) => {
          if (result.confirm) {
          }
        }
      })
    },
    async getTypeOrder (status) {
      const { openid } = wx.getStorageSync('userInfos')
      if (status === undefined) {
        const { data } = await this.$fly.post('/order/orderList', { openid })
        let orderList = data.data
        orderList.forEach((item, index) => {
          item.created_time = this.$moment(item.created_time).format(
            'YYYY-MM-DD HH:mm'
          )
        })
        this.orderList = orderList || []
      } else {
        const { data } = await this.$fly.post('/order/orderList', {
          openid,
          status
        })
        let orderList = data.data
        orderList.forEach((item, index) => {
          item.created_time = this.$moment(item.created_time).format(
            'YYYY-MM-DD HH:mm'
          )
        // console.log(item.created_time)
        })
        this.orderList = orderList || []
      }
    }
  },
  onShow () {
    this.getOrderList()
  }
}
</script>

<style lang="less">
.index {
  padding: 10rpx;
  .box {
    background-color: var(--themeColor);
    height: 160rpx;
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
        //   display: flex;
        //   align-items: center;
        //   justify-content: center;
        height: 32%;
        background-color: #ecf5ff;
        margin-bottom: 2rpx;
        border-radius: 8rpx;
        color: var(--themeColor);
        font-weight: 600;
        width: 450rpx;
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
  .title {
    background-color: var(--themeColor);
    height: 70rpx;
    padding: 10rpx;
    border-radius: 8rpx;
    display: flex;
    margin-bottom: 12rpx;
    font-family: serif;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-weight: 600;
  }
}
</style>
