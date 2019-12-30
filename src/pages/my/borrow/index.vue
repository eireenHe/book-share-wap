<template>
  <div class="page">
    <div class="page__bd">
      <div class="weui-panel weui-panel_access">
        <div class="weui-panel__bd">
          <div class="weui-media-box weui-media-box_text" :key="index" v-for="(book, index) in bookList" @tap="goScanCode(book.isbn)">
            <h4 class="weui-media-box__title">
              <span>{{book.title}}</span>
              <em class="returned" v-if="book.status === 2">已归还</em>
              <em class="borrowed" v-else>未归还</em>
            </h4>
            <div class="weui-media-box__desc">
              <p style="margin-top: 6px">作者: {{book.author}}</p>
              <p style="margin-top: 6px">借阅时间: {{book.borrow_time}}</p>
              <p style="margin-top: 6px" v-if="book.return_time">归还时间: {{book.return_time}}</p>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!bookList.length" class="weui-loadmore weui-loadmore_line">
        <span class="weui-loadmore__tips_in-line">暂无数据</span>
      </div>
    </div>
  </div>
</template>

<script>
  import { getBorrowBooks } from '../../../utils/http'

  export default {
    data () {
      return {
        bookList: []
      }
    },
    methods: {
      goScanCode (isbn) {
        wx.navigateTo({ url: '/pages/scanCode/main?isbn=' + isbn })
      }
    },
    mounted () {
      wx.setNavigationBarTitle({title: '我的借阅'})
      getBorrowBooks({ id: this.$store.state.account.id, office_id: this.$store.state.account.office_id }).then(data => {
        this.bookList = data
      })
    }
  }
</script>

<style lang="less">
  h4 {
    em {
      float: right;
      font-size: 14px;
      &.returned {
        color: #409EFF;
      }
      &.borrowed {
        color: #e64340;
      }
    }
  }
  .weui-panel {
    &:before, &:after {
      border: none;
    }
    .weui-panel__hd {
      &:after {
        border: none;
      }
      .weui-media-box:before {
        transform: scaleY(.5);
      }
    }
  }

</style>
