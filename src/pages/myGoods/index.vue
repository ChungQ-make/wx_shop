<template>
  <div class="index">
    <div class="title">长按可以管理商品</div>
    <div class="content">
      <div class="item">
        <div
          class="box"
          v-for="(item, index) in goodsList"
          :key="index"
          @longpress="
            item.status <= 2
              ? longCheckItem1(item.goods_id, item.status)
              : longCheckItem2(item.goods_id, item.status)
          "
        >
          <a :href="'/pages/goods_detail/main?goods_id=' + item.goods_id">
            <div class="item1">
              <div class="type">[名称]{{ item.goods_name }}</div>
              <div class="type">[编号]{{ item.goods_id }}</div>
              <div class="type">{{ item.created_time }}</div>
            </div>
          </a>
          <div class="item2">
            <div class="amount">{{ item.goods_price }}元</div>
            <div class="state" :style="state[item.status].color">
              {{ state[item.status].text }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="nothings" v-show="goodsList.length">
      您暂时还没有发布任何商品！
    </div> -->
    <!-- <div @click="show_pro()">点我显示弹窗</div> -->
    <!--弹窗的页面-->
    <div class="modalMask" v-if="isModel"></div>
    <div class="modalDialog" v-if="changeModel">
      <div class="modalContent">
        <div class="contentTip">
            <div class="Toptitle">增加的商品数量</div>
            <!-- 自动火狐焦点 -->
            <input type="number" class="input" v-model="addNum" focus>
        </div>
      </div>
      <div class="modalFooter">
        <div class="btnCancel" @tap="tapCancel">取消</div>
        <div class="btnConfirm" @tap="confirmSend">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      goodsList: [],
      state: [
        // 0 正常出售
        // 1 售罄（缺货）
        // 2 暂停售出
        // 3 禁止出售
        // 4 审核中
        // 5 审核不通过
        {
          text: '正常出售',
          color: 'color: #67C23A;'
        },
        {
          text: '售罄',
          color: 'color: #E6A23C;'
        },
        {
          text: '暂停售出',
          color: 'color: #606266;'
        },
        {
          text: '禁止出售',
          color: 'color: #9932CC;'
        },
        {
          text: '审核中',
          color: 'color: #F56C6C;'
        },
        {
          text: '审核不通过',
          color: 'color: #909399;'
        }
      ],
      status: 0,
      changeModel: false,
      isModel: false,
      addNum: '',
      goodsID: 0
    }
  },
  methods: {
    async getGoodsList () {
      const { openid } = wx.getStorageSync('userInfos')
      const { data } = await this.$fly.post('/goods/getMyGoods', { openid })
      this.goodsList = data.data
      this.goodsList.forEach((item, index) => {
        item.created_time = this.$moment(item.created_time).format(
          'YYYY-MM-DD HH:mm'
        )
      })
      this.goodsList.sort((a, b) => {
        return a.status - b.status
      })
      //   保存用户发布成功的商品数量
      const myGoodsNum = this.goodsList.filter((item) => {
        return item.status < 3
      }).length
      wx.setStorageSync('myGoodsNum', myGoodsNum)
    },
    // 用户管理权限（正常状态）
    longCheckItem1 (goodsID, status) {
      if (status === 2) {
        wx.showActionSheet({
          itemList: ['正常出售', '增加商品数量（无需审核）', '修改商品信息', '删除商品'],
          success: (res) => {
            if (res.tapIndex === 0) {
              this.toNormal(goodsID)
            } else if (res.tapIndex === 2) {
              this.editGoodsInfo(goodsID)
            } else if (res.tapIndex === 3) {
              this.deleteGoods(goodsID)
            } else if (res.tapIndex === 1) {
              this.goodsID = goodsID
              this.show_pro()
            }
          }
        })
      } else if (status === 0) {
        wx.showActionSheet({
          itemList: ['暂停出售', '增加商品数量（无需审核）', '修改商品信息', '删除商品'],
          success: (res) => {
            if (res.tapIndex === 0) {
              this.stopSell(goodsID)
            } else if (res.tapIndex === 2) {
              this.editGoodsInfo(goodsID)
            } else if (res.tapIndex === 3) {
              this.deleteGoods(goodsID)
            } else if (res.tapIndex === 1) {
              this.goodsID = goodsID
              this.show_pro()
            }
          }
        })
      } else if (status === 1) {
        wx.showActionSheet({
          itemList: [
            // '正常出售',
            '增加商品数量（无需审核）',
            '修改商品信息',
            '删除商品'
          ],
          success: (res) => {
            if (res.tapIndex === 0) {
              this.goodsID = goodsID
              this.show_pro()
            } else if (res.tapIndex === 1) {
              this.editGoodsInfo(goodsID)
            } else if (res.tapIndex === 2) {
              this.deleteGoods(goodsID)
            }
          }
        })
      }
    },
    // 审核状态
    longCheckItem2 (goodsID, status) {
      if (status === 5) {
        wx.showActionSheet({
          itemList: ['修改商品信息重新审核', '删除商品'],
          success: (res) => {
            if (res.tapIndex === 0) {
              this.editGoodsInfo(goodsID)
            } else if (res.tapIndex === 1) {
              this.deleteGoods(goodsID)
            }
          }
        })
      } else {
        wx.showActionSheet({
          itemList: ['删除商品'],
          success: (res) => {
            this.deleteGoods(goodsID)
          }
        })
      }
    },
    // 删除指定商品
    async deleteGoods (goodsID) {
      wx.showModal({
        title: '删除该商品？',
        content: '',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: async (result) => {
          if (result.confirm) {
            // console.log(goodsID)
            const { data } = await this.$fly.post('/goods/delete', {
              goods_id: goodsID
            })
            if (data.meta.status !== 200) {
              return wx.showToast({
                title: '删除失败！',
                icon: 'erron',
                image: '',
                duration: 2000,
                mask: true
              })
            }
            wx.showToast({
              title: '删除成功！',
              icon: 'success',
              image: '',
              duration: 2000,
              mask: true,
              success: (result) => {
                setTimeout(() => {
                  this.getGoodsList()
                }, 2000)
              }
            })
          }
        }
      })
    },
    // 修改商品状态为 暂停出售 （2）
    async stopSell (goodsID) {
      const { data } = await this.$fly.post('/goods/stopSell', {
        goods_id: goodsID
      })
      //   console.log(data)
      if (data.meta.status !== 200) {
        return wx.showToast({
          title: '操作失败！',
          icon: 'error',
          image: '',
          duration: 2000,
          mask: true
        })
      }
      this.getGoodsList()
    },
    // 修改商品状态为 正常出售 （0）
    async toNormal (goodsID) {
      const { data } = await this.$fly.post('/goods/toNormal', {
        goods_id: goodsID
      })
      if (data.meta.status !== 200) {
        return wx.showToast({
          title: '操作失败！',
          icon: 'error',
          image: '',
          duration: 2000,
          mask: true
        })
      }
      this.getGoodsList()
    },
    // 修改商品内容信息 状态将转为待审核状态（4）
    editGoodsInfo (goodsID) {
      wx.navigateTo({
        url: `/pages/editGoods/main?goods_id=${goodsID}`
      })
    },
    //  弹框取消
    tapCancel () {
    //   console.log('取消')
      this.changeModel = !this.changeModel
      this.isModel = !this.isModel
    },
    //  确认
    async confirmSend () {
    //   console.log('确认')
      const addNum = this.addNum * 1
      if (!addNum) {
        return wx.showToast({
          title: '请输入有效数据',
          icon: 'none',
          image: '',
          duration: 1500,
          mask: true
        })
      }
      const {data} = await this.$fly.post('/goods/addStocks', {addNum, goods_id: this.goodsID})
      if (data.meta.status !== 200) {
        return wx.showToast({
          title: '操作失败！',
          icon: 'error',
          image: '',
          duration: 1500,
          mask: true,
          success: (result) => {
            this.changeModel = !this.changeModel
            this.isModel = !this.isModel
          }
        })
      }
      wx.showToast({
        title: '添加成功！',
        icon: 'success',
        image: '',
        duration: 2000,
        mask: true,
        success: (result) => {
          this.changeModel = !this.changeModel
          this.isModel = !this.isModel
          setTimeout(() => {
            this.getGoodsList()
          }, 2000)
        }
      })
    },
    show_pro () {
      this.changeModel = !this.changeModel
      this.isModel = !this.isModel
    }
  },
  onShow () {
    this.getGoodsList()
  },
  // 下拉刷新事件 重置数据
  onPullDownRefresh () {
    this.getGoodsList()
  }
}
</script>

<style lang="less" scoped>
.index {
  padding: 10rpx;
  .title {
    height: 70rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
    font-style: 30rpx;
    font-family: serif;
    background-color: var(--themeColor);
    color: #fff;
    border-radius: 8rpx;
    margin-bottom: 10rpx;
  }
  .content {
    //   background-color: #fff;
    // padding: 8rpx;
    // background-color: var(--themeColor);
    // margin-bottom: 10rpx;
    // border-radius: 8rpx;
    .item {
      //   background-color: #fff;
      //   height: 130rpx;
      //   border-radius: 8rpx;
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
    }
  }
  .nothings {
    height: 200rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
    font-style: 30rpx;
    font-family: serif;
    background-color: var(--themeColor);
    color: #fff;
    border-radius: 8rpx;
    margin-bottom: 10rpx;
  }
}

/* 弹窗开始 */
.modalMask {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: #000;
  opacity: 0.5;
  overflow: hidden;
  z-index: 9000;
  color: #fff;
}
.modalDialog {
  box-sizing: border-box;
  width: 560rpx;
  overflow: hidden;
  position: fixed;
  top: 50%;
  left: 0;
  z-index: 9999;
  background: #fff;
  margin: -180rpx 95rpx;
  border-radius: 8rpx;
}
.modalContent {
  box-sizing: border-box;
  display: flex;
  padding: 50rpx 53rpx;
  font-size: 32rpx;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.contentTip {
  text-align: center;
  font-size: 36rpx;
  color: #333333;
  .Toptitle{
      background-color:var(--themeColor);
      border-radius: 8rpx;
      margin-bottom: 10rpx;
      font-size: 28rpx;
      color: #fff;
  }
}
.teleStyle {
  background: #ffffff;
  border: 1px solid #979797;
  border-radius: 6rpx;
  line-height: 50rpx;
  height: 50rpx;
  box-sizing: border-box;
  padding-left: 12rpx;
  width: 460rpx;
  font-size: 28rpx;
  /*color: rgba(0,0,0,0.25);*/
  margin-top: 30px;
}
.modalFooter {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  height: 100rpx;
  border-top: 1px solid #e5e5e5;
  font-size: 32rpx;
  line-height: 100rpx;
}
.btnCancel {
  width: 50%;
  font-size: 32rpx;
  color: #333;
  text-align: center;
  border-right: 1px solid #e5e5e5;
}
.btnConfirm {
  font-size: 32rpx;
  width: 50%;
  color: #508cee;
  text-align: center;
}
</style>
