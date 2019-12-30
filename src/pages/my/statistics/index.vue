<template lang="jade">
  .page
    .page_bd
      div
        div(class='navigation')
          div(v-if='role_id === 2' style="float: left; padding-left: 24px; height: 2.58823529em; line-height: 2.58823529em; width: 43%;") {{ office.location }}
          div(class="weui-cell weui-cell_input left" v-if="role_id === 1 && officeOptions.length")
            picker(@change="handleOffice" class="weui-select", :value="officeModel" mode="selector", :range="officeOptions" range-key="location" style="padding-left: 10px")
              .weui-input {{officeOptions[officeModel].location}}
          div(class="weui-cell weui-cell_input right" v-if="typeOptions.length")
            picker( @change="handleType" class="weui-select", :value="typeModel" mode="selector", :range="typeOptions" range-key="type")
              .weui-input {{typeOptions[typeModel].type}}
        div(v-if="!bookList.length" class="weui-loadmore weui-loadmore_line")
          span(class='weui-loadmore__tips_in-line') 暂无数据
        div(v-else class="shark-cells")
          div.shark-cell(:key="index" v-for="(book, index) in bookList")
            div.shark-cell__bd
              div.left
                img(:src="book.image")
              div.right
                p.shark-media-box__title {{book.title}}
                p.shark-media-box__desc {{book.shelf}}
                p.shark-media-box__desc {{book.borrow_person}}
                p.shark-media-box__time {{book.borrow_time}} ~ {{book.return_time}}
              p(class="chuo grey" v-if="book.return_time") 已还
              p(class="chuo" v-else-if="book.borrow_time && !book.return_time") 在借
</template>

<script>
  import { getLocationsById, getStatisticsBooks, getStatisticsCount } from '../../../utils/http'

  export default {
    data () {
      return {
        bookList: [],
        officeModel: 0,
        officeOptions: [
          {
            id: '',
            location: '',
            mechanism_id: 0
          }
        ],
        typeModel: 0,
        typeOptions: [
          {
            id: 1,
            type: '在借书籍'
          },
          {
            id: 2,
            type: '已还书籍'
          },
          {
            id: 3,
            type: '全部'
          }
        ],
        searchForm: {
          office_id: '',
          type_id: ''
        },
        office_id: '',
        role_id: '',
        office: {
          id: '',
          location: ''
        }
      }
    },
    methods: {
      getAllOfficeByMechanism () {
        this.$store.dispatch('getLocations')
          .then(res => {
            if (this.searchForm.office_id) {
              this.officeOptions = res.map((option, index) => {
                if (option.id === this.searchForm.office_id) {
                  this.officeModel = index
                }
                return option
              })
            } else {
              this.officeOptions = res
              this.searchForm.office_id = res[0].id
            }
          })
      },
      getLocationsById (id) {
        getLocationsById({id: id}).then((d) => {
          this.office = d[0]
        })
      },
      getStatisticsCount () {
        getStatisticsCount(this.searchForm).then(data => {
          wx.setNavigationBarTitle({title: `借阅统计·${data.person}人·${data.book}本`})
        })
      },
      getStatisticsBooks () {
        getStatisticsBooks(this.searchForm).then(data => {
          this.bookList = data
        })
      },
      handleOffice (e) {
        this.officeModel = e.target.value
        this.searchForm.office_id = this.officeOptions[this.officeModel].id
        this.getStatisticsCount()
        this.getStatisticsBooks()
      },
      handleType (e) {
        this.typeModel = e.target.value
        this.searchForm.type_id = this.typeOptions[this.typeModel].id
        this.getStatisticsCount()
        this.getStatisticsBooks()
      }
    },
    mounted () {
      this.office_id = this.$store.state.account.office_id
      this.role_id = this.$store.state.account.role_id
      if (this.role_id === 1) {
        this.getAllOfficeByMechanism()
      } else if (this.role_id === 2) {
        this.getLocationsById(this.office_id)
      }
      this.searchForm = {
        office_id: this.office_id,
        type_id: 1
      }
      this.getStatisticsCount()
      this.getStatisticsBooks()
    },
    onShow () {
      this.typeModel = 0
    }
  }
</script>

<style lang="less">
  .page {
    .navigation {
      background: #fff;
      margin-top: -1px;
      border-bottom: 1px solid #efefef;
      overflow: hidden;
      color: #02A0EA;
      font-size: 16px;
      font-weight: bold;
      .left {
        float: left;
        width: 45%;
      }
      .right {
        float: left;
        border-left: 1px solid #efefef;
      }
      .weui-select {
        border-right: 0;
      }
      .weui-cell {
        label {
          display: inline-block;
          margin: 8px 0 0 10px;
        }
      }
    }
    .shark-cells {
      padding-top: 1px;
      .shark-cell {
        background: #ffffff;
        padding: 5px 10px;
        border-bottom: 1px solid #efefef;
        .shark-cell__bd {
          position: relative;
          overflow: hidden;
          .left {
            float: left;
            img {
              width: 80px;
              height: 100px;
            }
          }
          .right {
            float: left;
            padding: 5px 0 5px 5px;
            p {
              font-size: 14px;
              color: #7D7E80;
              &.shark-media-box__title {
                font-size: 16px;
                font-weight: bold;
                color: #333;
              }
              &.shark-media-box__time {
                font-size: 12px;
              }
            }
          }
          .chuo {
            position:absolute;
            width:55px;
            height:55px;
            background:#FAE2E2;
            line-height:55px;
            text-align:center;
            font-size:14px;
            color:#F56C6C;
            right:30px;
            border:3px dashed #F56C6C;
            border-radius:50%;
            font-size:16px;
            font-weight:bold;
            top:20px;
            transform:rotate(-20deg);
            &.grey {
              border:3px dashed #c4c4c4;
              background:#efefef;
              color:#9f9f9f;
            }
          }
        }
      }
    }
  }
</style>
