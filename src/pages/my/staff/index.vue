<template>
  <div class="staff-warp">
    <div class="user-con">
      <div class="office" @tap="open" v-if="account.role_id === 1">
        <img src="/static/images/right.svg">
        <span style="">{{ office.location }}</span>
      </div>
      <div v-else-if="account.role_id === 2" class="location">
        <span>{{ office.location }}</span>
      </div>
      <div class="user-box">
        <img :src="wxAccount.avatarUrl">
        <p>Hi,{{wxAccount.nickName}}</p>
      </div>
      <div class="office-box" v-if="showOffice">
        <p v-for="ol in officeList" :key="ol.id" @tap="chooseOffice(ol)">{{ ol.location }}</p>
      </div>
    </div>
    <div class="invitat-box">
      <div class="cell">
        <img src="/static/images/share.svg">
      </div>
      <div class="cell">
        <button open-type='share' class="share">转发让员工加入</button>
      </div>
    </div>
    <div class="staff-con">
      <div class="item" v-for="al in usersList" :key="al">
        <div class="cell name">
          <span>{{ al.user_name }}</span>
        </div>
        <div class="cell email">
          <span>{{ al.email }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { getLocationsById, getUserOffice } from '../../../utils/http'

  export default {
    data () {
      return {
        account: {},
        wxAccount: {},
        officeList: [],
        usersList: [],
        showOffice: false,
        office: {}
      }
    },
    onShareAppMessage: function (res) {
      if (res.from === 'button') {
        // 来自页面内转发按钮
        console.log(res.target)
      }
      return {
        title: '邀请加入鲨鱼书院',
        imageUrl: '/static/images/shark-forward.png',
        path: '/pages/index/main'
      }
    },
    methods: {
      getLocationsById (id) {
        getLocationsById({id: id}).then((d) => {
          this.office = d[0]
        })
      },
      getAllOffice () {
        this.$store.dispatch('getLocations')
          .then((d) => {
            this.officeList = d
            this.office = d[0]
            this.getUserByOffice(this.office.id)
          })
      },
      open () {
        this.showOffice = true
      },
      chooseOffice (ol) {
        this.office = ol
        this.showOffice = false
        this.getUserByOffice(ol.id)
      },
      getUserByOffice (id) {
        getUserOffice({ id })
          .then((d) => {
            this.usersList = d
          })
      }
    },
    mounted () {
      wx.setNavigationBarTitle({title: '办公地点员工'})
      this.wxAccount = this.$store.state.wxAccount
      this.account = this.$store.state.account
      if (this.account.role_id === 1) {
        this.getAllOffice()
      } else if (this.account.role_id === 2) {
        this.getLocationsById(this.account.office_id)
        this.getUserByOffice(this.account.office_id)
      }
    }
  }
</script>

<style lang="less">
  .staff-warp {
    position: relative;
    p {
      padding: 15px 10px;
      color: #000000;
      font-size: 18px;
    }
    .user-con {
      background: #BEE4E8;
      padding-bottom: 30px;
      border-bottom-left-radius:3em 1em;
      border-bottom-right-radius:3em 1em;
      .office {
        overflow: hidden;
        padding: 10px;
        img {
          float:right;
          margin-top: -1px;
          width:30px;
          height:30px;
        }
        span {
          &:first-child {
            color: #ffffff;
          }
          &:last-child {
            float: right;
            color:#442800;
            font-size: 16px;
            margin-top: 3px;
          }
        }
      }
      .location {
        text-align: right;
        padding: 10px 10px 0 0;
        font-size: 16px;
      }
      .user-box {
        text-align: center;
        margin: 10px 30px;
        border-radius: 15px;
        img {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          margin-top: 10px;
        }
        p {
          margin: 0;
          padding: 5px 0 0 0;
          color: #ffffff;
        }
      }
      .office-box {
        position: absolute;
        background: #f2f2f2;
        box-shadow: 2px 0 12px 5px rgba(0,0,0,.1);
        z-index: 10;
        top: 40px;
        right: 10px;
        width: 170px;
        color: #6E6E6E;
        p {
          padding: 10px 10px 10px 20px;
          font-size: 16px;
        }
      }
    }
    .invitat-box {
      position: absolute;
      background:#fff;
      top: 180px;
      box-shadow: 2px 0 12px 5px rgba(0,0,0,.1);
      width: 86%;
      margin: 0 7% 20% 7%;
      border-radius: 5px;
      display: flex;
      .cell {
        flex: 1;
        &:first-child {
          flex: 0 0 36%;
          text-align: right;
          margin-right: 10px;
        }
        img {
          width: 30px;
          height: 30px;
          margin-top: 10px;
        }
        .share {
          text-align: left;
          background: #ffffff;
          font-size: 16px;
          padding: 8px 0;
          color: #442800;
          &::after {
            border: none;
          }
        }
      }

    }
    .staff-con {
      margin-top: 40px;
      .item {
        text-align: center;
        padding: 10px;
        overflow: hidden;
        .cell {
          float: left;
          display: inline-block;
          span {
            margin: 0;
            padding: 0;
            font-size: 16px;
          }
          &.name {
            width: 120px;
            color: #484848;
          }
          &.email {
            color: #7D7E80;
          }
        }
      }
    }
  }
</style>
