<template>
  <PageHeaderLayout >
    <div class="app-container dashboard-container">
      <img class="home-logo" src="../../../static/img/home-logo.png" alt="home-img">
      <img class="dashboard-container-img" src="../../../static/img/home-bg.jpg" alt="home-bg">
      <div class="copyright">Copyright &copy; 2019 Brain Matrix, All Rights Reserved</div>
    </div>
  </PageHeaderLayout>
</template>

<script>
import { mapGetters } from 'vuex'
import PageHeaderLayout from '@/components/PageHeaderLayout'
export default {
  name: 'Dashboard',
  components: { PageHeaderLayout },
  data() {
    return {
      chart: null
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  created() {
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard {
    &-container {
      margin: 0px;
    }
    &-text {
      font-size: 30px;
      line-height: 46px;
    }
  }
  .dashboard-container{
    height: calc(100vh - 127px);
    padding: 0;
    position: relative;
  }
  .home-logo{
    position: absolute;
    width: 680px;
    height: 182px;
    top: 50%;
    left: 50%;
    transform: translate(-70%, -50%);
  }
  .dashboard-container-img{
    height: 99%;
    width: 100%;
  }
  .copyright{
    width: 322px;
    position: absolute;
    bottom:5%;
    left: 50%;
    transform: translateX(-50%);
    color: #ccc;
    text-align: center;
    font-size: 12px;
  }
</style>
