<template>
  <div class="index">
    <div class="box">
      <view class="table">
        <block>
          <view class="tr bg-g">
            <view class="td item1">订单编号</view>
            <view class="td item2">{{ orderDetail.order_id }}</view>
          </view>
          <view class="tr">
            <view class="td item1">商品名称</view>
            <view class="td item2">{{ orderDetail.goods_name }}</view>
          </view>
          <view class="tr bg-g">
            <view class="td item1">商品编号</view>
            <view class="td item2">{{ orderDetail.goods_id }}</view>
          </view>
          <view class="tr">
            <view class="td item1">商品价格</view>
            <view class="td item2">{{ orderDetail.goods_price }}</view>
          </view>
          <view class="tr bg-g">
            <view class="td item1">总价</view>
            <view class="td item2">{{ orderDetail.totalPrice }}</view>
          </view>
          <view class="tr">
            <view class="td item1">数量</view>
            <view class="td item2">{{ orderDetail.totalNum }}</view>
          </view>
          <view class="tr bg-g">
            <view class="td item1">买家名称</view>
            <view class="td item2">{{ orderDetail.buyer_name }}</view>
          </view>
          <view class="tr">
            <view class="td item1">买家ID</view>
            <view class="td item2">{{ orderDetail.buyer_id }}</view>
          </view>
          <view class="tr bg-g">
            <view class="td item1">卖家名称</view>
            <view class="td item2">{{ orderDetail.seller_name }}</view>
          </view>
          <view class="tr">
            <view class="td item1">卖家ID</view>
            <view class="td item2">{{ orderDetail.seller_id }}</view>
          </view>
          <view class="tr bg-g">
            <view class="td item1">收货地址</view>
            <view class="td item2">{{ orderDetail.address }}</view>
          </view>
          <view class="tr">
            <view class="td item1">下单时间</view>
            <view class="td item2">{{ orderDetail.created_time }}</view>
          </view>
          <view class="tr bg-g">
            <view class="td item1">状态</view>
            <view class="td item2" :style="state[status].color">{{
              state[status].text
            }}</view>
            <!-- 下面这种直接传值会出错 可以将status单独报错到一个数据中 -->
            <!-- <view class="td item2" :style="state[orderDetail.status].color">{{ state[orderDetail.status].text }}</view> -->
          </view>
        </block>
      </view>
    </div>
    <div class="description">
      <div class="top">订单描述</div>
      <div class="weui-media-box__desc content">
        {{ orderDetail.description }}
      </div>
      <div class="input">
            <input type="text" placeholder="输入新的订单描述" v-model="description" />
            <span class="btn" @click="editDescription">发送</span>
      </div>
    </div>
    <div class="editAddress" @click="editAddress">修改地址</div> 
    <div class="takeGoods" @click="takeGoods">确认收货</div> 
    <div class="tuihuo" @click="returnGoods">申请退货</div> 
  </div>
</template>

<script>
export default {
  data () {
    return {
      orderDetail: {},
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
      status: 0,
      description: ''
    }
  },
  methods: {
    async getOrderDetail () {
      //   console.log(this.$root.$mp.query.order_id)\
      const orderID = this.$root.$mp.query.order_id
      const { data } = await this.$fly.post('/order/detail', {
        order_id: orderID
      })
      const orderDetail = data.data
      orderDetail.created_time = this.$moment(orderDetail.created_time).format(
        'YYYY-MM-DD HH:mm'
      )
      this.status = orderDetail.status
      this.orderDetail = orderDetail
    },
    // 修改订单描述
    async editDescription () {
      const description = this.description.trim()
      if (!description) {
        return wx.showToast({
          title: '请不要输入空数据',
          icon: 'none',
          image: '',
          duration: 1500,
          mask: true,
          success: (result) => {
            this.description = ''
          }
        })
      }
      const {data} = await this.$fly.post('/order/editDes', {description, order_id: this.orderDetail.order_id})
      if (data.meta.status !== 200) {
        return wx.showToast({
          title: '修改失败！请稍后重试',
          icon: 'erron',
          image: '',
          duration: 1500,
          mask: true
        })
      }
      this.orderDetail.description = description
      this.description = ''
      wx.showToast({
        title: '添加成功！',
        icon: 'success',
        image: '',
        duration: 1500,
        mask: true
      })
    },
    // 修改地址
    async editAddress () {
      const orderID = this.orderDetail.order_id
      const res = await wx.chooseAddress()
      const address = res.provinceName + res.cityName + res.countyName + res.detailInfo
      const {data} = await this.$fly.post('/order/editAddress', {order_id: orderID, address})
      if (data.meta.status !== 200) {
        return wx.showToast({
          title: '修改地址失败！',
          icon: 'erron',
          image: '',
          duration: 2000,
          mask: true
        })
      }
      wx.showToast({
        title: '修改地址成功！',
        icon: 'success',
        image: '',
        duration: 1500,
        mask: true
      })
    },
    // 退货申请
    async returnGoods () {
      const orderID = this.orderDetail.order_id
      console.log(orderID)
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
    async takeGoods () {
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
    }
  },
  onShow () {
    this.getOrderDetail()
  }
}
</script>

<style lang="less">
page {
  background-color: #fffafa;
}

.index {
  padding: 12rpx;
  .box {
    background-color: #fff;
    border-radius: 8rpx;
    // height: 500rpx;
    .table {
      border: 0px solid darkgray;
      color: rgb(107, 107, 107);
    }
    .tr {
      display: flex;
      width: 100%;
      //   justify-content: center;
      height: 80rpx;
      align-items: center;
    }
    .td {
      align-items: center;
    }
    .item1 {
      width: 30%;
      //   text-align: center;
    }
    .item2 {
      width: 70%;
      overflow: hidden;
    }
    .bg-w {
      background: snow;
    }
    .bg-g {
      background: #e6f3f9;
    }
    .th {
      width: 40%;
      justify-content: center;
      background: #3366ff;
      color: #fff;
      display: flex;
      height: 80rpx;
      align-items: center;
    }
  }
  .description {
    margin-top: 20rpx;
    background-color: #6a5acd;
    border-radius: 8rpx;
    padding: 8rpx;
    .top {
      color: #fff;
    }
    .content {
      border-radius: 8rpx;
      height: 100rpx;
      background-color: #fff;
      //   white-space: nowrap;
      //   text-overflow: ellipsis;
      //   overflow: hidden;
      margin-bottom: 8rpx;
    }
    .input{
        display: flex;
        input {
            flex: 2;
            border-radius: 8rpx 0 0 8rpx;
            background-color: #fff;
            height: 70rpx;
        }
        .btn{
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #DCDCDC;
            font-weight: 600;
            color: #fff;
            // margin-left: 10rpx;
            border-radius:0 8rpx 8rpx 0;
            flex: 1;
            height: 70rpx;
        }
    }
  }
  .tuihuo{
      margin-top: 10rpx;
      background-color: #FF6A6A;
      border-radius: 8rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 70rpx;
      color: #fff;
      font-size: 38rpx;
      font-family: serif;
      font-weight: 600;
  }
  .editAddress{
      margin-top: 10rpx;
      background-color: #00CD66;
      border-radius: 8rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 70rpx;
      color: #fff;
      font-size: 38rpx;
      font-family: serif;
      font-weight: 600;
  }
  .takeGoods{
      margin-top: 10rpx;
      background-color: #FFA500;
      border-radius: 8rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 70rpx;
      color: #fff;
      font-size: 38rpx;
      font-family: serif;
      font-weight: 600;
  }
}
</style>
