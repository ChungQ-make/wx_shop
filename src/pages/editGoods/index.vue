<template>
  <div class="index">
    <div class="title">填写需要修改的商品信息</div>
    <div class="content">
      <div class="weui-cells__group weui-cells__group_form">
        <!-- <div class="weui-cells__title">表单组标题</div> -->
        <div class="weui-cells weui-cells_form">
          <div class="weui-cell weui-cell_active weui-cell_disabled">
            <div class="weui-cell__hd">
              <label class="weui-label">商家编号</label>
            </div>
            <div class="weui-cell__bd">
              <input
                class="weui-input"
                :value="form.seller_id"
                disabled
              />
            </div>
          </div>
          <div class="weui-cell weui-cell_active weui-cell_disabled">
            <div class="weui-cell__hd">
              <label class="weui-label">商家名称</label>
            </div>
            <div class="weui-cell__bd">
              <input
                class="weui-input"
                :value="form.seller"
                disabled
              />
            </div>
          </div>
          <div class="weui-cell weui-cell_active">
            <div class="weui-cell__hd">
              <label class="weui-label">商品名称</label>
            </div>
            <div class="weui-cell__bd">
              <input
                id="js_input"
                class="weui-input"
                placeholder="填写商品名称"
                v-model="form.goods_name"
                focus
              />
            </div>
          </div>
          <div class="weui-cell weui-cell_active">
            <div class="weui-cell__hd">
              <label class="weui-label">商品价格</label>
            </div>
            <div class="weui-cell__bd">
              <input
                id="js_input"
                class="weui-input"
                type="digit"
                v-model="form.goods_price"
                placeholder="填写商品价格"
              />
            </div>
          </div>
          <div class="weui-cell weui-cell_active">
            <div class="weui-cell__hd">
              <label class="weui-label">商品数量</label>
            </div>
            <div class="weui-cell__bd">
              <input
                id="js_input"
                class="weui-input"
                type="number"
                v-model="form.stocks"
                placeholder="填写商品数量"
              />
            </div>
          </div>
          <div
            class="weui-cell weui-cell_active weui-cell_select weui-cell_select-after"
          >
            <div class="weui-cell__hd">
              <label for="" class="weui-label">商品类型</label>
            </div>
            <div class="weui-cell__bd">
              <picker
                @change="bindCategoriesChange"
                :value="categoriesIndex"
                :range="categories"
              >
                <view class="weui-select weui-select_in-select-after">{{
                  categories[categoriesIndex]
                }}</view>
              </picker>
            </div>
          </div>
          <div class="weui-cell weui-cell_active">
            <div class="weui-cell__hd">
              <label class="weui-label">联系电话</label>
            </div>
            <div class="weui-cell__bd">
              <input
                id="js_input"
                class="weui-input"
                placeholder="填写绑定的电话号码"
                type="number"
                pattern="[0-9]*"
                v-model="form.telNumber"
              />
            </div>
          </div>
          <div class="weui-cells weui-cells_form">
            <div class="weui-cell">
              <div class="weui-cell__bd">
                <textarea
                  class="weui-textarea"
                  placeholder="请描述你的商品"
                  rows="4"
                  v-model="form.description"
                ></textarea>
                <div class="weui-textarea-counter"><span>0</span>/200</div>
              </div>
            </div>
          </div>

          <!-- 图片上传 -->
          <div class="Uploadtip">请上传您的商品图片</div>
          <div class="weui-uploader__bd th-backwhite clearfix">
            <div class="weui-uploader__files" id="uploaderFiles">
              <block v-for="(item, index) in files" :key="index">
                <div
                  class="weui-uploader__file posi-rela"
                  @click="predivImage"
                  :id="item"
                >
                  <icon
                    type="cancel"
                    size="20"
                    class="th-icon-cancel"
                    @click.stop="deletImg(index)"
                  />
                  <image
                    class="weui-uploader__img"
                    :src="item"
                    mode="aspectFill"
                  />
                </div>
              </block>
            </div>
            <div class="weui-uploader__input-box">
              <div class="weui-uploader__input" @click="chooseImage"></div>
            </div>
          </div>

          <div class="th-submit-btn" @click="release">提交</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        seller: '',
        seller_id: '',
        goods_name: '',
        goods_imgUrl: [],
        goods_price: '',
        description: '',
        goods_type: '',
        stocks: '',
        telNumber: ''
      },
      categories: [],
      categoriesIndex: 0,
      files: [],
      filesOnline: []
    }
  },
  methods: {
    chooseImage (e) {
      var _this = this
      wx.chooseImage({
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          _this.files = _this.files.concat(res.tempFilePaths)

          var tempFilePaths = res.tempFilePaths
          // console.log(tempFilePaths)
          wx.uploadFile({
            url: 'http://localhost:5000/api/public/v1/goods/upload', // 模拟接口(后期需要改成线上地址)
            filePath: tempFilePaths[0],
            // ! 这个 name 一定要和后端文件组名保持一致 否则会出错
            name: 'img',
            header: {
              'Content-Type': 'multipart/form-data'
            },
            success: function (res) {
              //   console.log(res.data)
              if (JSON.parse(res.data).err_code === 1) {
                wx.showToast({
                  title: '上传失败！图片格式只支持 png、jpg、bmp、jpeg',
                  icon: 'none',
                  image: '',
                  duration: 2000,
                  mask: true
                })
                _this.files.pop()
              } else {
                // _this.filesOnline = _this.filesOnline.concat(
                //   // JSON.parse(res.data).data
                // )
                _this.filesOnline.push(
                  'http://localhost:5000/' +
                    JSON.parse(res.data).data.url.replace(/\\/g, '/')
                )
                _this.form.goods_imgUrl = _this.filesOnline
              }
            }
          })
        },
        fail: function () {
          //   console.log('fail')
        },
        complete: function () {
          //   console.log('commplete')
        }
      })
    },
    // 放大显示事件
    predivImage (e) {
      console.log(e)
      wx.previewImage({
        current: e.currentTarget.id, // 当前显示图片的http链接
        urls: this.files // 需要预览的图片http链接列表
      })
    },
    // 删除图片
    deletImg (index) {
      this.files.splice(index, 1)
      this.filesOnline.splice(index, 1)
    },
    bindCategoriesChange (e) {
      this.categoriesIndex = e.mp.detail.value
      this.form.goods_type = this.categories[this.categoriesIndex]
    },
    // 获取用户openid 和 用户名
    async getInitialData () {
      const goodsID = this.$root.$mp.query.goods_id
      const { data } = await this.$fly.get('/categories/names')
      const oldFormData = await this.$fly.get('/goods/detail', {goods_id: goodsID})
      this.form = oldFormData.data.data
      this.categories = data.data
      this.files = this.form.goods_imgUrl
      this.filesOnline = this.form.goods_imgUrl
    },
    // 提交表单事件
    async release () {
      let formData = this.form
      formData.goods_name = formData.goods_name.trim()
      formData.goods_price = formData.goods_price * 1
      formData.stocks = formData.stocks * 1
      //   this.formData.goods_type = this.categories[this.categoriesIndex]
      if (formData.goods_name === '' || formData.goods_imgUrl.length === 0) {
        return wx.showToast({
          title: '请完善商品信息！',
          icon: 'none',
          image: '',
          duration: 1500,
          mask: true
        })
      }
      //   console.log('formData ----------->' + formData.goods_type)
      const {data} = await this.$fly.post('/goods/editGoods', formData)
      //   console.log('data -------->' + data.data.goods_type)
      if (data.meta.status !== 201) {
        return wx.showToast({
          title: '提交失败！请重试',
          icon: 'error',
          image: '',
          duration: 1500,
          mask: true
        })
      }
      wx.showToast({
        title: '请等待审核通过',
        icon: 'success',
        image: '',
        duration: 2000,
        mask: true
      })
      //   清空表单数据
      this.form = {
        seller: '',
        seller_id: '',
        goods_name: '',
        goods_imgUrl: [],
        goods_price: 0,
        description: '',
        goods_type: '',
        stocks: 0,
        telNumber: ''
      }
      this.categories = []
      this.categoriesIndex = 0
      this.files = []
      this.filesOnline = []
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/user/main'
        })
      }, 3000)
    }
  },
  onShow () {
    //   获取初始数据
    this.getInitialData()
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
    background-color: var(--themeColor);
    border-radius: 8rpx;
    height: 70rpx;
    color: #fff;
    font-size: 30rpx;
    font-weight: 600;
    font-family: serif;
    margin-bottom: 8rpx;
  }
  .content {
    .Uploadtip {
      margin-top: 15rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 70rpx;
      background-color: var(--themeColor);
      border-radius: 8rpx;
      color: #fff;
      margin-bottom: 8rpx;
    }
  }
}
.th-icon-cancel {
  position: absolute;
  background-color: #fff;
  border-radius: 50%;
  right: -14rpx;
  top: -14rpx;
}
.weui-uploader__input-box {
  margin-right: 0;
}
.weui-uploader__bd {
  margin-bottom: 0;
}
.posi-rela {
  position: relative;
  overflow: visible;
}
.weui-uploader__file:nth-child(3n) {
  margin-right: 0;
}
.th-backwhite {
  width: 750rpx;
  padding: 20rpx 30rpx;
  box-sizing: border-box;
  background-color: #fff;
  border-bottom: 4rpx solid #f5f5f5;
}
/* 绿色贯穿按钮 */
.th-submit-btn {
  width: 690rpx;
  height: 90rpx;
  line-height: 90rpx;
  background-color: #18c136;
  margin: 50rpx auto;
  color: #fff;
  font-size: 34rpx;
  text-align: center;
  border-radius: 6rpx;
}
</style>
