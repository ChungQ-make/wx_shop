<template>
  <div class="index">
    <div class="title">{{ userInfos.nickName }}的个人商店</div>
    <div class="search">
      <input
        v-model="inputValue"
        placeholder="搜索店内商品"
        @input="handleInput"
      />
      <div class="btn1" @click="handleCancel">取消</div>
    </div>
    <div class="sellerInfos">
      <div class="box1">
        <div class="avatarBox">
          <img :src="userInfos.avatarUrl" alt="" />
        </div>
      </div>
      <div class="infos">
        <div class="text">[昵称]&nbsp;&nbsp;&nbsp;{{ userInfos.nickName }}</div>
        <div class="text">
          [性别]&nbsp;&nbsp;&nbsp;{{ userInfos.gender === 0 ? "女士" : "男士" }}
        </div>
        <div class="text">[家乡]&nbsp;&nbsp;&nbsp;{{ userInfos.province }}</div>
        <div class="text">
          [注册时间]&nbsp;&nbsp;&nbsp;{{ userInfos.created_time }}
        </div>
      </div>
    </div>
    <div class="goodsInfos">
      <div class="item" v-for="(item, index) in goodsList" :key="index">
        <img
          :src="item.goods_imgUrl[0]"
          alt=""
          mode="widthFix"
          @click="toGoodsDetail(item.goods_id)"
        />
        <div>{{ item.goods_name }}</div>
        <div class="price">￥{{ item.goods_price }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      userInfos: {},
      goodsList: [],
      inputValue: '',
      timer: -1,
      backupGoodsList: []
    }
  },
  methods: {
    //   获取该用户数据
    async getUerinfos () {
      const openid = this.$root.$mp.query.openid
      const { data } = await this.$fly.post('/user/getUerinfo', { openid })
      if (data.meta.status === 200) {
        this.userInfos = data.data
        this.userInfos.created_time = this.$moment(
          this.userInfos.created_time
        ).format('YYYY-MM-DD')
      }
    },
    // 获取该用户商品列表
    async getGoodsList () {
      const openid = this.$root.$mp.query.openid
      const { data } = await this.$fly.get('/goods/sellerGoods', { openid })
      if (data.meta.status !== 200) {
        return wx.showToast({
          title: '获取商品数据失败！',
          icon: 'none',
          image: '',
          duration: 1500,
          mask: true
        })
      }
      this.goodsList = data.data.sort((a, b) => {
        return b.pageViews - a.pageViews
      })
      this.backupGoodsList = this.goodsList
    },
    // 跳转至商品详情页
    toGoodsDetail (goodsID) {
      wx.navigateTo({
        url: `/pages/goods_detail/main?goods_id=${goodsID}`
      })
    },
    handleInput () {
      // 检验合法性
      if (!this.inputValue.trim()) {
        // 值不合法
        return 0
      }
      //   防抖处理
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.getQueryData(this.inputValue.trim())
      }, 1000)
    },
    handleCancel () {
      // 取消重置输入框数据 并重新获取全部商品列表即可
      this.inputValue = ''
      this.getGoodsList()
    },
    // 查询操作 这里的查询操作直接对goodsList操作即可
    getQueryData (query) {
      //  ! 每次查询操作前 获取备份数据进行数据重置（这里直接调用getGoodsList()会无法生效）
      this.goodsList = this.backupGoodsList
      //   this.getGoodsList()
      let search = []
      //   this.goodsList.forEach((item, index) => {
      //     if (item.goods_name.indexOf(query)) {
      //       search.push(item)
      //     }
      //   })
      const reg = new RegExp(query, 'gi')
      search = this.goodsList.filter((item, index) => {
        // return item.goods_name.indexOf(query)> 0
        // *  使用 search() 提高查询效率
        return item.goods_name.search(reg) > 0
      })
      this.goodsList = search
    },
    // 下拉刷新 重置数据
    onPullDownRefresh () {
      this.getGoodsList()
    }
  },
  onShow () {
    this.getUerinfos()
    this.getGoodsList()
  }
}
</script>

<style  lang="less">
page {
  background-color: #ecf5ff;
  font-size: 28rpx;
}

.index {
  padding: 10rpx;
  .search {
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
  .title {
    height: 70rpx;
    border-radius: 8rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 8rpx;
    font-family: serif;
    font-weight: 600;
    background-color: #6a5acd;
    color: #fff;
  }
  .sellerInfos {
    height: 280rpx;
    background-color: #fff;
    margin-top: 15rpx;
    border-radius: 8rpx;
    margin-bottom: 15rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .box1 {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-left: 35rpx;
      .avatarBox {
        // flex: 1;
        border: 1px solid #eee;
        border-radius: 50%; //圆形
        padding: 10px;
        box-shadow: 0 0 10px #ddd; //阴
        background-color: #fff;
        width: 180rpx;
        height: 180rpx;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: #eee;
        }
      }
    }
    .infos {
      padding: 8rpx;
      box-sizing: border-box;
      height: 100%;
      width: 420rpx;
      margin-right: 18rpx;
      display: flex;
      flex-wrap: wrap;
      .text {
        overflow: hidden;
        width: 100%;
        height: 45rpx;
        border-bottom: #eee 2rpx solid;
      }
    }
  }
  .goodsInfos {
    border-radius: 8rpx;
    margin-bottom: 30rpx;
    display: flex;
    flex-wrap: wrap;
    .item {
      border-radius: 8rpx;
      height: 400rpx;
      width: 50%;
      background-color: #fff;
      // border-bottom: 1px solid #fff;
      margin-bottom: 8rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      border: #ecf5ff 4rpx solid;
      box-sizing: border-box;
      overflow: hidden;
      color: #606266;
      img {
        border-radius: 8rpx;
        margin-top: 10rpx;
        width: 80%;
        // object-fit: fill;
      }
      .price {
        color: #f56c6c;
      }
    }
  }
}
</style>
