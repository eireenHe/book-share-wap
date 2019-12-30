<template>
  <div class="counter-warp">
    <div v-if="book.status !== 4">
      <div class="img-box">
        <img src="/static/images/bookbg.png" style="height: 120px">
        <div class="img">
          <img :src="book.image">
        </div>
      </div>
      <div class="book-info">
        <p class="title">{{ book.title }}</p>
        <p class="author">{{ book.author }}</p>
        <div v-if="account.role_id === 3">
          <p class="empty" v-if="book.status !== 0">
            <span>{{ book.shelf }}</span>
            <span v-if="book.sponsors"> · {{book.sponsors}}</span>
          </p>
          <p class="empty" v-if="book.status === 0">～～该书籍还未录入～～</p>
          <p class="empty" v-if="book.status === 3">～～来晚一步～～</p>
          <p v-if="book.status === 1"><a class="blue" @tap="borrowBook">借阅</a></p>
          <p v-if="book.status === 2"><a class="blue" @tap="returnBook">归还</a></p>
        </div>
        <div v-else>
          <view class="section" v-if="categoryOptions.length" >
            <picker @change="bindCategoryChange" :value="categoryModel" mode="selector" :range="categoryOptions" range-key="category">
              <view class="picker">
                <span style="font-size: 16px">分类：{{categoryOptions[categoryModel].category}}</span>
                <img src="/static/images/right.png" class="right"/>
              </view>
            </picker>
          </view>
          <view class="section" v-if="shelfOptions.length" >
            <picker @change="bindShelfChange" :value="shelfModel" mode="selector" :range="shelfOptions" range-key="shelf">
              <view class="picker">
                <span style="font-size: 16px; min-width: 100px">书架：{{shelfOptions[shelfModel].shelf}}</span>
                <img src="/static/images/right.png" class="right"/>
              </view>
            </picker>
          </view>
          <view style="overflow: hidden; margin-left: 106px">
            <label style="float: left;font-size:16px;">产权人:</label>
            <input placeholder="输入产权人" v-model="book.sponsors" style="float: left;text-align:left;margin-left:10px;width:80px;font-size: 16px;border-bottom:1px solid #c4c4c4;">
          </view>
          <div v-if="book.status === 0">
            <p><a class="blue" @tap="handleAdd">录入</a></p>
          </div>
          <div v-if="book.status !== 0">
            <p v-if="account.id === book.entry_id"><a class="blue" @tap="handleUpdate">保存</a></p>
            <div v-else class="empty">
              <p class="empty">{{ book.category }}</p>
              <p class="empty">
                <span>{{ book.shelf }}</span>
                <span v-if="book.sponsors"> · {{book.sponsors}}</span>
              </p>
              <p class="empty" v-if="book.status === 1">～～该书籍已录入～～</p>
            </div>
          </div>
        </div>
        <pre v-if="book.summary">
          简介：{{ book.summary }}
        </pre>
      </div>
    </div>
    <!--<div v-else>-->
      <!--&lt;!&ndash;<div @tap="uploadBook" style="width: 100%; height: 100px">&ndash;&gt;-->
        <!--&lt;!&ndash;<div style="position: relative; width: 70px; height: 100px; border: 1px solid #efefef; margin: 0 auto">&ndash;&gt;-->
          <!--&lt;!&ndash;<img v-if="book.image" :src="book.image" style="border: 1px solid #efefef; width: 70px; height: 100px"/>&ndash;&gt;-->
          <!--&lt;!&ndash;<div style="position: absolute; left: 50%; margin-left: -10px; margin-top: 30px">&ndash;&gt;-->
            <!--&lt;!&ndash;<img src="/static/images/upload.svg" style="width: 20px; height: 20px;">&ndash;&gt;-->
          <!--&lt;!&ndash;</div>&ndash;&gt;-->
        <!--&lt;!&ndash;</div>&ndash;&gt;-->
      <!--&lt;!&ndash;</div>&ndash;&gt;-->
      <!--<div @tap="uploadBook" style="width: 100%; height: 100px">-->
        <!--<div style="position: relative; width: 70px; height: 100px; border: 1px solid #efefef; margin: 0 auto">-->
          <!--<img v-if="book.image" :src="book.image" style="width: 70px; height: 100px"/>-->
        <!--</div>-->
      <!--</div>-->
      <!--<div class="page">-->
        <!--<div class="page__bd">-->
          <!--<div class="weui-cells weui-cells_form">-->
            <!--<div class="weui-cell weui-cell_input weui-cell_vcode">-->
              <!--<div class="weui-cell__hd"><label class="weui-label">分  类</label></div>-->
              <!--<div class="weui-cell__bd" v-if="categoryOptions.length">-->
                <!--<picker @change="bindCategoryChange" :value="categoryModel" mode="selector" :range="categoryOptions" range-key="category">-->
                  <!--<view class="picker">-->
                    <!--{{categoryOptions[categoryModel].category}}-->
                  <!--</view>-->
                <!--</picker>-->
              <!--</div>-->
            <!--</div>-->
            <!--<div class="weui-cell weui-cell_input weui-cell_vcode">-->
              <!--<div class="weui-cell__hd"><label class="weui-label">书  架</label></div>-->
              <!--<div class="weui-cell__bd" v-if="shelfOptions.length">-->
                <!--<picker @change="bindShelfChange" :value="shelfModel" mode="selector" :range="shelfOptions" range-key="shelf">-->
                  <!--<view class="picker">-->
                    <!--{{shelfOptions[shelfModel].shelf}}-->
                  <!--</view>-->
                <!--</picker>-->
              <!--</div>-->
            <!--</div>-->
            <!--<div class="weui-cell weui-cell_input">-->
              <!--<div class="weui-cell__hd"><label class="weui-label">编 码</label></div>-->
              <!--<div class="weui-cell__bd">-->
                <!--<input class="weui-input" v-model="book.isbn" placeholder="请输入书籍编码">-->
              <!--</div>-->
            <!--</div>-->
            <!--<div class="weui-cell weui-cell_input">-->
              <!--<div class="weui-cell__hd">-->
                <!--<label class="weui-label">名 称</label>-->
              <!--</div>-->
              <!--<div class="weui-cell__bd">-->
                <!--<input class="weui-input" v-model="book.title" placeholder="请输入书籍名称">-->
              <!--</div>-->
            <!--</div>-->
            <!--<div class="weui-cell weui-cell_input">-->
              <!--<div class="weui-cell__hd"><label class="weui-label">作 者</label></div>-->
              <!--<div class="weui-cell__bd">-->
                <!--<input class="weui-input" v-model="book.author" type="email" placeholder="请输入作者">-->
              <!--</div>-->
            <!--</div>-->
            <!--<div class="weui-cell weui-cell_input">-->
              <!--<div class="weui-cell__hd"><label class="weui-label">出版社</label></div>-->
              <!--<div class="weui-cell__bd">-->
                <!--<input class="weui-input" v-model="book.publisher" type="email" placeholder="请输入出版社">-->
              <!--</div>-->
            <!--</div>-->
            <!--<div class="weui-cell weui-cell_input">-->
              <!--<div class="weui-cell__hd"><label class="weui-label">出版日期</label></div>-->
              <!--<div class="weui-cell__bd">-->
                <!--<input class="weui-input" v-model="book.pubdate" type="email" placeholder="请选择出版日期">-->
              <!--</div>-->
            <!--</div>-->
            <!--<div class="weui-cell weui-cell_input">-->
              <!--<div class="weui-cell__hd"><label class="weui-label">页数</label></div>-->
              <!--<div class="weui-cell__bd">-->
                <!--<input class="weui-input" v-model="book.pages" type="email" placeholder="请输入页数">-->
              <!--</div>-->
            <!--</div>-->
          <!--</div>-->
          <!--<div class="weui-btn-area">-->
            <!--<mp-button type="primary" :loading="loading" size="large" @click="save">保存</mp-button>-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>-->
  </div>
</template>

<script>
  import filters from '@/filters'
  import { getBookDetail, addBook, returnBook, borrowBook, getAllCategory, getAllShelf, updateBook } from '../../utils/http'
  import mpButton from 'mpvue-weui/src/button'
  const app = getApp()

  export default {
    filters: filters,
    components: {
      mpButton
    },
    data () {
      return {
        isbn: '',
        book: {
          isbn: '',
          title: '',
          author: '',
          score: '',
          publisher: '',
          pubdate: '',
          image: '',
          pages: '',
          url: '',
          price: '',
          entry_person: '',
          entry_id: 0,
          summary: '',
          category_id: 0,
          shelf_id: 0,
          status: 0,
          sponsors: ''
        },
        status: -1,
        account: {},
        categoryModel: 0,
        categoryOptions: [],
        shelfModel: 0,
        shelfOptions: []
      }
    },
    computed: {
      addNew () {
        return this.account.role_id !== 3 && this.book.status === 0
      }
    },
    methods: {
      scanCode () {
        wx.showLoading({
          title: '加载中'
        })
        getBookDetail({
          book_isbn: this.isbn,
          borrow_person: this.account.user_name,
          office_id: this.account.office_id
        }).then(data => {
          wx.hideLoading()
          this.book = data
          const wxAccount = this.$store.state.wxAccount
          const account = this.$store.state.account
          app.aldstat.sendEvent('查看书籍详情', {
            '地理位置': wxAccount.province,
            '昵称': wxAccount.nickName,
            '邮箱': account.email,
            'openId': wxAccount.signature,
            '时间': filters.fixTimeStamp(new Date())
          })
        })
      },
      handleAdd () {
        let errorDump = ''
        if (this.categoryOptions.length === 0 || this.shelfOptions.length === 0) {
          errorDump = '请先设置类目及书架'
        }
        if (this.categoryOptions[this.categoryModel].id === 0) {
          errorDump = '请先选择类目'
        }
        if (this.shelfOptions[this.shelfModel].id === 0) {
          errorDump = '请先选择书架'
        }
        if (errorDump) {
          wx.showToast({
            icon: 'none',
            title: errorDump
          })
          wx.navigateTo({ url: '/pages/my/storage/main' })
          return false
        }
        if (this.book.sponsors === '' || this.book.sponsors === undefined) {
          wx.showToast({
            icon: 'none',
            title: '请输入产权人'
          })
          return false
        }
        addBook({
          book_isbn: this.book.isbn,
          title: this.book.title,
          author: this.book.author[0],
          score: this.book.score,
          publisher: this.book.publisher,
          pubdate: this.book.pubdate,
          image: this.book.image,
          pages: this.book.pages,
          url: this.book.url,
          price: this.book.price,
          entry_person: this.account.user_name,
          entry_id: this.account.id,
          summary: this.book.summary,
          category_id: this.categoryOptions[this.categoryModel].id,
          shelf_id: this.shelfOptions[this.shelfModel].id,
          office_id: this.account.office_id,
          sponsors: this.book.sponsors
        }).then(() => {
          wx.showToast({ title: '录入成功' })
          wx.switchTab({ url: '/pages/index/main' })
        })
      },
      borrowBook () {
        // 借书（判断是否已经借了2本未归还）
        borrowBook({
          book_isbn: this.book.isbn,
          borrow_person: this.account.user_name,
          borrow_id: this.account.id,
          office_id: this.account.office_id
        }).then(data => {
          if (data.changedRows === 1) {
            wx.showToast({ title: '借阅成功' })
            wx.switchTab({ url: '/pages/index/main' })
          }
        })
      },
      returnBook () {
        returnBook({
          book_isbn: this.book.isbn,
          borrow_person: this.account.user_name,
          borrow_id: this.account.id,
          office_id: this.account.office_id
        }).then((data) => {
          if (data.changedRows === 1) {
            wx.showToast({ title: '归还成功' })
            wx.switchTab({ url: '/pages/index/main' })
          }
        })
      },
      getCategoryAndShelf () {
        const id = this.account.office_id
        Promise.all([getAllCategory({ id }), getAllShelf({ id })]).then(([catgories, shelfs]) => {
          this.categoryOptions = catgories
          this.shelfOptions = shelfs
        })
      },
      bindCategoryChange (e) {
        this.categoryModel = e.target.value
      },
      bindShelfChange (e) {
        this.shelfModel = e.target.value
      },
      handleUpdate () {
        let pramas = {
          office_id: this.account.office_id,
          category_id: this.categoryOptions[this.categoryModel].id,
          shelf_id: this.shelfOptions[this.shelfModel].id,
          sponsors: this.book.sponsors,
          book_isbn: this.book.isbn
        }
        updateBook(pramas)
          .then(res => {
            console.log(res)
            wx.switchTab({ url: '/pages/index/main' })
          })
          .catch(() => {
            this.loading = false
          })
      },
      // uploadBook () {
      //   wx.chooseImage({
      //     success: res => {
      //       const tempFilePaths = res.tempFilePaths
      //       wx.uploadFile({
      //         url: 'https://sharkbook.mljr.com/books/upload', // 仅为示例，非真实的接口地址
      //         filePath: tempFilePaths[0],
      //         name: 'file',
      //         formData: {
      //           // user: 'test'
      //         },
      //         success: res => {
      //           const data = JSON.parse(res.data)
      //           console.log(data)
      //           // do something
      //           this.book.image = 'https://sharkbook.mljr.com/uploads/' + data.filename
      //         }
      //       })
      //     }
      //   })
      // },
      save () {
        let error = ''
        let errorJump = ''
        if (this.categoryOptions.length === 0 || this.shelfOptions.length === 0) {
          errorJump = '请先设置类目及书架'
        }
        if (this.categoryOptions[this.categoryModel].id === 0) {
          errorJump = '请先选择类目'
        }
        if (this.shelfOptions[this.shelfModel].id === 0) {
          errorJump = '请先选择书架'
        }
        if (this.book.isbn === '') {
          error = '请输入编码'
        }
        if (this.book.title === '') {
          error = '请输入名称'
        }
        if (this.book.author === '') {
          error = '请输入作者'
        }
        if (this.book.publisher === '') {
          error = '请输入出版社'
        }
        if (this.book.pubdate === '') {
          error = '请输入出版日期'
        }
        if (this.book.pages === 0) {
          error = '请输入页数'
        }
        if (this.book.image === '') {
          error = '请上传图片'
        }
        if (errorJump) {
          wx.showToast({
            icon: 'none',
            title: errorJump
          })
          wx.navigateTo({ url: '/pages/my/storage/main' })
          return false
        }
        if (error) {
          wx.showToast({
            icon: 'none',
            title: error
          })
          return false
        }
        addBook({
          book_isbn: this.book.isbn,
          title: this.book.title,
          author: this.book.author,
          score: '无',
          publisher: this.book.publisher,
          pubdate: this.book.pubdate,
          image: this.book.image,
          pages: this.book.pages,
          url: '',
          price: 0,
          entry_person: this.account.user_name,
          entry_id: this.account.id,
          summary: this.book.summary,
          category_id: this.categoryOptions[this.categoryModel].id,
          shelf_id: this.shelfOptions[this.shelfModel].id,
          office_id: this.$store.state.account['office_id']
        }).then(() => {
          wx.showToast({ title: '录入成功' })
          wx.switchTab({ url: '/pages/index/main' })
        })
      }
    },
    onShow () {
      this.account = this.$store.state.account
      this.isbn = this.$root.$mp.query.isbn
      this.scanCode()
      this.addNew && this.getCategoryAndShelf()
    }
  }
</script>

<style lang="less">
  .counter-warp {
    .img-box {
      position: relative;
      & > img {
        width: 100%;
        height: 170px;
      }
      .img {
        position: absolute;
        top: 55%;
        left: 50%;
        margin-left: -40px;
        box-shadow: 2px 0 12px 5px rgba(0,0,0,.1);
        img {
          width: 80px;
          height: 110px
        }
      }
    }
    .book-info {
      text-align: center;
      margin-top: 70px;
      .title {
        color: #1F1F1F;
        font-size: 20px;
      }
      .author {
        padding: 0;
        margin-top: 15px;
        color: #A7A7A7;
        font-size: 12px;
      }
      .right {
        width:12px;
        height:12px;
        margin-left:10px;
      }
      p {
        text-align: center;
        &.empty {
          padding: 0;
          margin-top: 15px;
          color: #EB6C70;
          font-size: 16px;
        }
        a {
          background: #409EFF;
          width: 50px;
          height: 30px;
          line-height: 30px;
          margin: 15px auto 0 auto;
          border-radius: 5px;
          color: #fff;
          font-size: 14px;
        }
      }

      pre {
        text-align: left;
        margin: 15px;
        line-height: 20px;
        font-size: 12px;
        color: #888888;
      }
    }
    .page {
      .weui-cell_vcode {
        height: 40px;
        .picker {
          font-size: 16px;
        }
      }
      .weui-label {
        display: inline-block;
        text-align:justify;
        width: 80px;
      }
    }
  }
</style>
