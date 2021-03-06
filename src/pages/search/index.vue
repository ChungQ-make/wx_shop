<template>
  <div>
    <div class="search_row">
      <div class="box">
        <input
          v-model="inputValue"
          placeholder="请输入您要搜索的商品"
          @input="handleInput"
        />
        <div class="btn1" @click="handleCancel">取消</div>
      </div>
    </div>
    <div class="search_content">
        <div class="box">
            <div class="item" v-for="(item, index) in goodsList" :key="index">
                    <div class="weui-panel__bd">
      <a
        :href="'/pages/goods_detail/main?goods_id=' + item.goods_id"
        class="weui-media-box weui-media-box_appmsg GoodsItem"
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
          <p class="weui-media-box__desc">【卖家】{{ item.seller }}</p>
          <p class="weui-media-box__desc">
            【上架时间】{{ item.created_time }}
          </p>
        </div>
      </a>
    </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      inputValue: '',
      goodsList: [],
      // 定时器标识
      timer: -1
    }
  },
  methods: {
    handleInput (e) {
      // 检验合法性
      if (!this.inputValue.trim()) {
        // 值不合法
        return 0
      }
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.getQueryData(this.inputValue)
      }, 1000)
    },
    handleCancel () {
      this.inputValue = ''
      this.goodsList = []
    },
    async getQueryData (query) {
      const { data } = await this.$fly.get('/goods/search', { query })
      this.goodsList = data.data.goodsList
      this.goodsList.forEach((item) => {
        item.created_time = this.$moment(item.created_time).format(
          'YYYY-MM-DD HH:mm'
        )
      })
    }
  }
}
</script>

<style lang="less">
page {
  background-color: #f1efe0;
}

.search_row {
  padding: 15rpx;
  .box {
    height: 60rpx;
    display: flex;
    input {
      border-radius: 8rpx;
      background-color: #fff;
      flex: 3;
      height: 100%;
      // padding-left: 30rpx;
    }
    .btn1 {
      border-radius: 8rpx;
      background-color: #fff;
      flex: 1;
      height: 100%;
    margin-left: 10rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 26rpx;
    }
  }
}

.search_content {
  margin-top: 15rpx;
  padding: 15rpx;
  .box{
      .item{
          border-radius: 15rpx;
          background-color: #fff;
          margin-bottom: 10rpx;
      }
  }
}

.GoodsItem {
  border-bottom: 2rpx solid #fff;
}
</style>
