<template lang="jade">
  .page
    .page_bd
      div(class="weui-cells weui-cells_form")
        div(class="weui-cell weui-cell_input weui-cell_vcode" v-if="categoryOptions.length")
          .weui-cell__hd
            label.weui-label 分类
          .weui-cell__bd
            picker(class="weui-select weui-select_in-select-after" @change="bindCategoryChange", :value="categoryModel" mode="selector", :range="categoryOptions" range-key="category")
              .weui-input {{categoryOptions[categoryModel].category}}
        div(class="weui-cell weui-cell_input weui-cell_vcode" v-if="shelfOptions.length")
          .weui-cell__hd
            label.weui-label 书架
          .weui-cell__bd
            picker(class="weui-select weui-select_in-select-after" @change="bindShelfChange", :value="shelfModel" mode="selector", :range="shelfOptions" range-key="shelf")
              .weui-input {{shelfOptions[shelfModel].shelf}}
        div(class="weui-cell weui-cell_input")
          .weui-cell__hd
            label.weui-label 归属人
          .weui-cell__bd
            input.weui-input(v-model="bookForm.sponsors" placeholder="请输入归属人")
      div.weui-btn-area
        mp-button(type="primary", :loading="loading" size="large" @click="hanleSave") 保存
</template>

<script>
  import mpButton from 'mpvue-weui/src/button'
  import { getAllCategory, getAllShelf, updateBook } from '../../../../utils/http'

  export default {
    components: {
      mpButton
    },
    data () {
      return {
        categoryOptions: [
          {
            id: '',
            category: '',
            office_id: 0
          }
        ],
        shelfOptions: [
          {
            id: '',
            shelf: '',
            office_id: 0
          }
        ],
        categoryModel: 0,
        shelfModel: 0,
        bookForm: {
          office_id: '',
          category_id: '',
          shelf_id: '',
          sponsors: '',
          book_isbn: ''
        }
      }
    },
    methods: {
      getCategoryAndShelf () {
        wx.showLoading({
          title: '加载中'
        })
        const id = this.$store.state.account.office_id
        Promise.all([getAllCategory({ id }), getAllShelf({ id })]).then(([catgories, shelfs]) => {
          wx.hideLoading()
          this.categoryOptions = catgories.map((option, index) => {
            if (option.id === Number(this.bookForm.category_id)) {
              this.categoryModel = index
            }
            return option
          })
          this.shelfOptions = shelfs.map((option, index) => {
            if (option.id === Number(this.bookForm.shelf_id)) {
              this.shelfModel = index
            }
            return option
          })
        })
      },
      bindCategoryChange (e) {
        this.categoryModel = e.target.value
        this.bookForm.category_id = this.categoryOptions[this.categoryModel].id
      },
      bindShelfChange (e) {
        this.shelfModel = e.target.value
        this.bookForm.shelf_id = this.shelfOptions[this.shelfModel].id
      },
      hanleSave () {
        updateBook(this.bookForm)
          .then(res => {
            console.log(res)
            this.loading = false
            wx.navigateTo({ url: '/pages/my/entry/main' })
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    onShow () {
      this.bookForm = this.$root.$mp.query
      wx.setNavigationBarTitle({title: '我的录入调整'})
      this.getCategoryAndShelf()
    }
  }
</script>

<style lang="less">
  .page {
    .picker {
      img {
        float: right;
        width: 20px;
        height: 20px;
      }
    }
    .weui-label {
      display: block;
      width: 95px;
    }
    .weui-cells {
      &:before, &:after {
        border: none;
      }
      .weui-cell:before {
        transform: scaleY(.5);
      }
    }
  }
</style>
