<template>
  <div class="counter-warp">
    <p style="">他人申请</p>
    <ul>
      <li>
        <span>书A</span>
        <span>1</span>
      </li>
      <li>
        <span>书B</span>
        <span>2</span>
      </li>
      <li>
        <span>书C</span>
        <span>3</span>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    computed: {
    },
    methods: {
    }
  }
</script>

<style lang="less">
  .counter-warp {
    p {
      padding: 15px 10px;
      color: #010001;
      font-size: 18px;
    }
    ul {
      background: #ffffff;
      padding: 0 10px;
      color: #373637;
      font-size: 16px;
      li {
        height: 45px;
        line-height: 45px;
        border-bottom: 1px solid #EEEEEE;
        span {
          &:last-child {
            float: right;
            margin-right: 10px;
            color: #9A9A9B;
          }
        }
        &:last-child {
          border-bottom: none;
        }
      }
    }
  }
</style>
