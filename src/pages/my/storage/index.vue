<template>
  <div class="page">
    <div class="page__hd">
      <div class="user">
        <img :src="wxAccount.avatarUrl"/>
        <p>Hello {{wxAccount.nickName}}</p>
      </div>
    </div>
    <div class="page__bd">
      <div class="weui-panel weui-panel_access">
        <div class="weui-panel__hd">办公地点</div>
        <div class="weui-panel__bd">
          <div class="weui-cells weui-cells_after-title">
            <div class="weui-cell weui-cell_input weui-cell_vcode">
              <div class="weui-cell__bd" v-if="account.role_id === 1">
                <picker v-if="officeList.length" @change="bindPickerChange" class="weui-select weui-select_in-select-after" :value="officeModel" mode="selector" :range="officeList" range-key="location">
                  <div class="weui-input">{{officeList[officeModel].location}}</div>
                </picker>
              </div>
              <div v-else-if="account.role_id === 2">
                <p class="location">{{ office.location }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="weui-panel">
        <div class="weui-panel__hd">书籍类目</div>
        <div class="weui-panel__bd">
          <ul>
            <li v-for="ol in categoryList" :key="ol.id" @longpress="isClose">
              <p @tap="handleEditCategory(ol)">{{ ol.category }}</p>
              <img src="/static/images/close.svg" v-show="bClose" @tap="delOffice(ol)"/>
            </li>
            <li class="add" @tap="handleAddCategory">
              <span>添加</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="weui-panel">
        <div class="weui-panel__hd">书籍存放地点</div>
        <div class="weui-panel__bd">
          <ul class="">
            <li v-for="ol in shelfList" :key="ol.id" @longpress="isClose">
              <p @tap="handleEditShelf(ol)">{{ ol.shelf }}</p>
              <img src="/static/images/close.svg" v-show="bClose" @tap="delOffice(ol)"/>
            </li>
            <li class="add" @tap="handleAddShelf">
              <span>添加</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <modal title="添加" :hidden="!showCategory" confirm-text="保存" cancel-text="取消" @cancel="cancelCategory" @confirm="saveCategory">
      <input v-model="category.category" placeholder="请输入书籍类目" auto-focus/>
    </modal>
    <modal title="添加" :hidden="!showShelf" confirm-text="保存" cancel-text="取消" @cancel="cancelShelf" @confirm="saveShelf">
      <input v-model="shelf.shelf" placeholder="请输入存放地点" auto-focus/>
    </modal>
  </div>
</template>

<script>
  import { getLocationsById, getAllShelf, getAllCategory, addCategory, addShelf, updateCategory, updateShelf } from '../../../utils/http'

  export default {
    data () {
      return {
        office: {
          id: '',
          location: ''
        },
        officeList: [],
        categoryList: [],
        shelfList: [],
        bClose: false,
        showCategory: false,
        showShelf: false,
        show: true,
        officeModel: 0,
        category: {
          id: '',
          category: '',
          office_id: 0
        },
        shelf: {
          id: '',
          shelf: '',
          office_id: 0
        },
        account: {},
        wxAccount: {}
      }
    },
    methods: {
      getLocationsById (id) {
        getLocationsById({id: id}).then((d) => {
          console.log('d', d)
          console.log(d[0])
          this.office = d[0]
        })
      },
      bindPickerChange (e) {
        this.officeModel = e.target.value
        this.office = this.officeList[this.officeModel]
        this.getCategoryAndShelf(this.office.id)
      },
      getAllOffice () {
        wx.showLoading({
          title: '加载中'
        })
        this.$store.dispatch('getLocations')
          .then((d) => {
            this.officeList = d
            this.office = this.officeList[this.officeModel]
            if (this.officeList.length > 0) {
              this.getCategoryAndShelf(this.office.id)
            } else {
              wx.hideLoading()
            }
          })
          .catch(err => {
            console.log(err.status, err.message)
          })
      },
      getCategoryAndShelf (id) {
        wx.showLoading({
          title: '加载中'
        })
        Promise.all([getAllCategory({ id }), getAllShelf({ id })]).then(([categoryList, shelfList]) => {
          this.categoryList = categoryList
          this.shelfList = shelfList
          console.log('categoryList', categoryList)
          console.log('shelfList', shelfList)
          wx.hideLoading()
        })
      },
      handleAddCategory () {
        this.showCategory = true
        this.category = {
          id: '',
          category: ''
        }
      },
      handleEditCategory (category) {
        this.showCategory = true
        this.category = category
      },
      handleAddShelf () {
        this.showShelf = true
        this.shelf = {
          id: '',
          shelf: ''
        }
      },
      handleEditShelf (shelf) {
        this.showShelf = true
        this.shelf = shelf
      },
      cancelCategory () {
        this.showCategory = false
      },
      cancelShelf () {
        this.showShelf = false
      },
      saveCategory () {
        if (this.category.category === '') {
          wx.showToast({
            icon: 'none',
            title: '请输入类目'
          })
          return false
        }
        if (this.category.id) {
          updateCategory({
            id: this.category.id,
            category: this.category.category,
            office_id: this.office.id
          }).then(() => {
            this.showCategory = false
          })
        } else {
          addCategory({
            category: this.category.category,
            office_id: this.office.id
          }).then(res => {
            this.categoryList.push({
              id: res.insertId,
              category: this.category.category,
              office_id: this.office.id
            })
            this.showCategory = false
          })
        }
      },
      saveShelf () {
        if (this.shelf.shelf === '') {
          wx.showToast({
            icon: 'none',
            title: '请输入存放地点'
          })
          return false
        }
        if (this.shelf.id) {
          updateShelf({
            id: this.shelf.id,
            shelf: this.shelf.shelf,
            office_id: this.office.id
          }).then(() => {
            this.showShelf = false
          })
        } else {
          addShelf({
            shelf: this.shelf.shelf,
            office_id: this.office.id
          }).then(res => {
            this.shelfList.push({
              id: res.insertId,
              shelf: this.shelf.shelf,
              office_id: this.office.id
            })
            this.showShelf = false
          })
        }
      }
    },
    mounted () {
      wx.setNavigationBarTitle({title: '书籍类目及存放地点'})
      this.wxAccount = this.$store.state.wxAccount
      this.account = this.$store.state.account
      if (this.account.role_id === 1) {
        this.getAllOffice()
      } else if (this.account.role_id === 2) {
        this.getLocationsById(this.account.office_id)
        this.getCategoryAndShelf(this.account.office_id)
      }
    }
  }
</script>

<style lang="less">
  .page {
    .user {
      position:relative;
      text-align: center;
      padding: 20px 0 10px 0;
      .my {
        position: absolute;
        top: 15px;
        left: 15px;
        font-size: 18px;
        color: #000
      }
      img {
        width: 70px;
        height: 70px;
        border-radius: 50%
      }
      p {
        padding-top: 10px;
        color:#999CA2;
        font-size: 16px;
      }
    }

    .weui-panel {
      .weui-panel__hd {
        &:after {
          transform: scaleY(.5);
        }
      }
      .weui-cells:after,
      .weui-cells:before {
        border: 0;
      }

      .weui-select {
        border-right: 0;
      }

      &:after,
      &:before {
        border: 0;
      }

      .location {
        margin-top: 10px;
        font-size: 16px;
      }

      ul {
        background: #ffffff;
        display: flex;
        flex-wrap: wrap;
        justify-content: left;
        margin:0 10px;
        color: #373637;
        font-size: 16px;
        li {
          position: relative;
          background: #F6F7FB;
          height: 35px;
          line-height: 35px;
          margin: 2%;
          width: 29%;
          text-align: center;
          border-radius: 20px;
          color: #090A17;
          p {
            min-width: 20px;
            height: 35px;
            line-height: 35px;
          }
          &.add {
            background: #fff;
            border: 1px solid #F6F7FB;
            color: #409EFF;
          }
          img {
            position: absolute;
            width: 15px;
            height: 15px;
            top: -3px;
            left: -3px;
          }
        }
      }
    }
  }
</style>
