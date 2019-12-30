<template lang="jade">
  div(v-if="role_id !== 10")
    .search-bar
      div
        img.scan(src="/static/images/scan.svg" @click="scanCode")
        input(type="text" v-model="filters.keyword" placeholder="搜索书名 | 作者")
        img(class="search" src="/static/images/search.svg" @tap="confirm")
    div(v-if="total > 0")
      ul
        li(v-for="(item, index) in bookList", :key="index" @tap="goScanCode(item)")
          img(:src="item.image")
          section
            p.item_title {{ item.title }}
            p {{ item.author }}
            p 豆瓣评分 {{ item.score }}
            div(v-if="users.role_id === 3")
              p(class="green" v-if="item.total > 0") 还有 {{item.total}} 本可借
              p(class="yellow" v-else) 已被借完
      a(v-if="hasMore" @tap="getbookInfo('more')" style="color:#F56C6C;;text-align:center;font-size:14px;") 查看更多
    p(v-else-if="total === 0" style="color:#F56C6C;margin-top:50px;text-align:center;") nothing,通知管理员录入吧!!!
  div(v-else class="tips")
    p 系统管理员没有查询书籍的权限噢～～
</template>

<script>
  import filters from '@/filters'
  import { getUsersBySignature } from '../../utils/http'
  const app = getApp()

  export default {
    filters: filters,
    data () {
      return {
        filters: {
          keyword: ''
        },
        size: 15,
        start: 0,
        total: -1,
        hasMore: true,
        bookList: [],
        users: {
          user_name: '',
          work_num: '',
          role_id: ''
        },
        role_id: {}
      }
    },
    methods: {
      scanCode () {
        wx.scanCode({
          success: (res) => {
            if (res.result.substring(0, 3) === '978') {
              if (this.$store.state.account.office_id === 0) {
                wx.showToast({
                  icon: 'none',
                  title: '请先设置办公地点'
                })
                wx.navigateTo({ url: '/pages/my/office/main' })
              } else {
                wx.navigateTo({ url: '/pages/scanCode/main?isbn=' + res.result })
              }
            } else {
              wx.showToast({
                icon: 'none',
                title: '请扫码书籍二维码'
              })
            }
          }
        })
      },
      goScanCode (item) {
        if (this.$store.state.account.office_id === 0) {
          wx.showToast({
            icon: 'none',
            title: '请先设置办公地点'
          })
        } else {
          wx.navigateTo({ url: '/pages/scanCode/main?isbn=' + item.book_isbn })
        }
      },
      getbookInfo (type) {
        let size = this.size
        if (type !== 'more') {
          this.start = 0
          size = Math.max(this.$store.state.loadedSize, this.size)
        } else {
          wx.showLoading({
            title: '加载中'
          })
        }
        this.$http.post('https://sharkbook.mljr.com/books/getBooksByCondition', {
          start: this.start,
          size: size,
          office_id: this.$store.state.account.office_id,
          title: this.filters.keyword
        })
          .then((d) => {
            console.log('d', d)
            if (d.status === 200) {
              wx.hideLoading()
              this.start += size
              this.total = d.data.total
              this.bookList = type === 'more' ? this.bookList.concat(d.data.books) : d.data.books
              this.$store.state.loadedSize = this.bookList.length
              this.hasMore = this.bookList.length < this.total
              const wxAccount = this.$store.state.wxAccount
              const account = this.$store.state.account
              app.aldstat.sendEvent('查看书架', {
                '地理位置': wxAccount.province,
                '昵称': wxAccount.nickName,
                '邮箱': account.email,
                'openId': wxAccount.signature,
                '时间': filters.fixTimeStamp(new Date())
              })
            }
          })
          .catch(err => {
            wx.hideLoading()
            console.log(err.status, err.message)
          })
      },
      confirm () {
        this.getbookInfo()
      }
    },
    create () {
      this.getbookInfo()
    },
    onShow () {
      wx.getSetting({
        success: res0 => {
          if (res0.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: res => {
                console.log('res', res)
                this.$store.commit('setWxAccount', res.userInfo)
                // 用户已经授权过
                console.log('用户已经授权过')
                getUsersBySignature({
                  signature: res.signature
                }).then(data => {
                  if (data.length === 0) {
                    let account = {
                      id: 0,
                      user_name: '',
                      work_num: '',
                      email: '',
                      code: '',
                      old_role: 0,
                      role_id: 0,
                      alternate_role: 0,
                      office_id: 0,
                      mechanism_id: 0,
                      signature: res.signature
                    }
                    this.$store.commit('setAccount', account)
                    wx.navigateTo({ url: '/pages/grant/main' })
                  } else {
                    let user = data[0]
                    this.users.role_id = user.old_role = user.role_id
                    let $account = this.$store.state.account
                    if ($account === undefined) {
                      this.$store.commit('setAccount', user)
                    } else if ($account !== undefined) {
                      if ($account.role_id === 0) {
                        this.$store.commit('setAccount', user)
                      } else {
                        this.users.role_id = $account.role_id
                      }
                    }
                    this.getbookInfo()
                  }
                })
              }
            })
          } else {
            console.log('用户还未授权过')
            wx.navigateTo({ url: '/pages/grant/main' })
          }
        }
      })
    }
  }
</script>

<style lang="less">
  .search-bar {
    background: #FDFDFD;
    padding: 15px;
    div {
      overflow: hidden;
      background: #ffffff;
      box-shadow: 2px 0 12px 5px rgba(0,0,0,.1);
      input {
        float: left;
        width: 71%;
        padding: 10px 0 10px 10px;
        border: 1px solid transparent;
        font-size: 14px;
      }
      img {
        float: right;
        width: 32px;
        height: 45px;
        line-height: 45px;
        padding: 0 2px;
        font-size: 14px;
        color: #ffffff;
        &.search {
          width: 25px;
          margin-right: 10px;
        }
        &.scan {
          float: left;
          margin-left: 10px;
        }
      }
    }
  }
  ul {
    padding: 10px 15px;
    li {
      overflow: hidden;
      margin-bottom: 10px;
      padding-bottom: 10px;
      border-bottom: 1px solid #f5f7fa;
      img {
        float: left;
        width: 72px;
        height: 100px;
      }
      section {
        float: left;
        margin-left: 20px;
        p {
          color: #484848;
          font-size: 16px;
          &.item_title {
            width:245px;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
          }
          &:not(:first-child) {
            margin-top: 8px;
            color: #7D7E80;
            font-size: 12px;
          }
        }
        div {
          margin-top: 8px;
          p {
            font-size: 12px;
            &.green {
              color: #409EFF;
            }
            &.yellow {
              color: #E6A23C;
            }
          }
        }
      }
    }
  }
  .tips {
    text-align: center;
    margin: 100px auto 0 auto;
    font-size: 16px;
    color: #e84393;
  }
</style>
