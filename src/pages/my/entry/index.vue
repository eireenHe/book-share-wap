<template lang="jade">
  .page
    .page_bd
      div(v-if="!bookList.length" class="weui-loadmore weui-loadmore_line")
        span(class='weui-loadmore__tips_in-line') 暂无数据
      div(v-else class="shark-cells")
        div.shark-cell(:key="index" v-for="(book, index) in bookList")
          div.shark-cell__bd
            div.left
              p.shark-media-box__title {{book.title}}
              p.shark-media-box__desc 作者：{{book.author}}
              p.shark-media-box__desc 书架：{{book.shelf}}
</template>

<script>
  import { getEntryBooks } from '../../../utils/http'

  export default {
    data () {
      return {
        bookList: []
      }
    },
    methods: {
      // handleEdit (book) {
      //   if (book.sponsors === null) { book.sponsors = '' }
      //   wx.navigateTo({ url: '/pages/my/entry/edit/main?office_id=' + this.$store.state.account.office_id + '&shelf_id=' + book.shelf_id + '&sponsors=' + book.sponsors + '&book_isbn=' + book.isbn + '&category_id=' + book.category_id })
      // }
    },
    mounted () {
      wx.setNavigationBarTitle({title: '我的录入'})
      getEntryBooks({ id: this.$store.state.account.id, office_id: this.$store.state.account.office_id }).then(data => {
        this.bookList = data
      })
    }
  }
</script>

<style lang="less">
  .page {
    .shark-cells {
      padding-top: 1px;
      .shark-cell {
        background: #ffffff;
        margin: 10px 0;
        padding: 12px;
        .shark-cell__bd {
          overflow: hidden;
          .left {
            float: left;
            .shark-media-box__title {
              font-size: 18px;
              margin-bottom: 5px;
            }
            .shark-media-box__desc {
              font-size: 14px;
              color: #7D7E80;
            }
          }
          .right {
            float: right;
            padding: 10px 0 10px 10px;
            border-left:1px dashed #efefef;
            img {
              width: 25px;
              height: 25px
            }
            p {
              font-size: 14px;
              color: #74CDF7;
            }
          }
        }
      }
    }
  }
</style>
