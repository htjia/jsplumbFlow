<template>
  <div :class="classObj" class="app-wrapper">
    <div class="layout-container">
      <div class="header-bar" style="background:#009494 url('../static/img/yk_bg.png') no-repeat top right;">
        <img class="logo-img" src="../../../static/img/sys-logo.png" alt="logo-img">
        <div class="header-info" >
          <span><svg-icon icon-class="user"/> 欢迎， {{ getToken }}</span>
          <!-- <span><span class="cut-line"/><i class="el-icon-info"/> 剩余授权期限：{{ dataTime }}天！</span> -->
          <!-- <span class="change-password" @click="changePassword"><span class="cut-line"/><i class="el-icon-edit"/> 修改密码</span> -->
          <span class="logout" @click="logout"><span class="cut-line"/><svg-icon icon-class="logout"/> 注销</span>
        </div>
      </div>
      <div style="flex-grow: 1;overflow: auto">
        <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"/>
        <sidebar class="sidebar-container"/>
        <div class="main-container">
          <navbar @refresh = "refresh" @submitFlowData="submitFlowData" @runFlowData="runFlowData"/>
          <app-main ref="AppMain"/>
        </div>
      </div>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="changePasswordDialogVisible"
      :before-close="handleClose"
      title="修改密码"
      width="500px">
      <el-form ref="passwordForm" :model="passwordForm" :rules="passwordRules" status-icon label-width="80px" label-position="left">
        <el-form-item label="旧密码" prop="oldPwd">
          <el-input v-model="passwordForm.oldPwd" type="password"/>
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd">
          <el-input v-model="passwordForm.newPwd" type="password"/>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassWord">
          <el-input v-model="passwordForm.confirmPassWord" type="password"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitPawForm('passwordForm')">确 定</el-button>
        <el-button @click="resetForm('passwordForm')">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { licenseInfo } from '@/api/login'
import { getToken, getUserId } from '@/utils/auth'
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapGetters } from 'vuex'
import { updatePwd } from '@/api/user'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  mixins: [ResizeMixin],
  data() {
    const validateConfirmPassWord = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('请输入确认密码'))
      } else {
        if (value.length < 6) {
          callback(new Error('密码不能小于 6 位'))
        } else if (value.length > 20) {
          callback(new Error('密码不能大于 20 位'))
        } else if (value !== this.passwordForm.newPwd) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      }
    }
    const validateOldPwd = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('请输入旧密码'))
      } else {
        if (this.passwordForm.newPwd === value) {
          callback(new Error('新旧密码不能相同'))
        } else {
          callback()
        }
      }
    }
    const validateNewPwd = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('请输入新密码'))
      } else {
        if (this.passwordForm.oldPwd === value) {
          callback(new Error('新旧密码不能相同'))
        } else {
          callback()
        }
      }
    }
    return {
      changePasswordDialogVisible: false,
      passwordForm: {
        oldPwd: '',
        newPwd: '',
        confirmPassWord: ''
      },
      passwordRules: {
        oldPwd: [{ required: true, validator: validateOldPwd, trigger: 'blur' }],
        newPwd: [{ required: true, validator: validateNewPwd, trigger: 'blur' }],
        confirmPassWord: [{ required: true, validator: validateConfirmPassWord, trigger: 'blur' }]
      },
      dataTime: '0'
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    },
    ...mapGetters([
      'name',
      'roles'
    ]),
    getToken
  },
  mounted() {
    // getMeuns({ id: getUserId() }).then(response => {
    //   const data = response.data
    //   if (data && data.length > 0) { // 验证返回的roles是否是一个非空数组
    //     sessionStorage.setItem('menu', JSON.stringify(data))
    //   }
    // })
    // this.licenseInfos()

  },
  methods: {
    // 验证是否过期
    licenseInfos() {
      licenseInfo().then(res => {
        this.dataTime = res.data.days
      }, res => {
        if (res.response.data.data === undefined) {
          this.timeState = 1
        } else {
          this.dataTime = res.response.data.data.days
          if (res.response.data.data.days === 0) {
            this.timeState = 1
          }
        }
      })
    },
    handleClickOutside() {
      this.$store.dispatch('CloseSideBar', { withoutAnimation: false })
    },
    changePassword() {
      this.changePasswordDialogVisible = true
      this.passwordForm.oldPwd = ''
      this.passwordForm.newPwd = ''
      this.passwordForm.confirmPassWord = ''
    },
    // 关闭
    handleClose(done) {
      done()
    },
    // 修改密码确认
    submitPawForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            oldPassword: this.passwordForm.oldPwd,
            newPassword: this.passwordForm.newPwd,
            userId: getUserId()
          }
          updatePwd(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              this.changePasswordDialogVisible = false
              this.fetchData()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 取消
    resetForm(formName) {
      this.changePasswordDialogVisible = false
      this.$refs[formName].resetFields()
    },
    logout() {
      this.$confirm('确认注销并返回登录页面？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('LogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      }).catch(() => {
      })
    },
    refresh() {
      this.$refs.AppMain.fetchData()
    },
    submitFlowData() {
      this.$refs.AppMain.submitFlowData()
    },
    runFlowData() {
      this.$refs.AppMain.runFlowData()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
    .layout-container{
      height: 100%;
      .header-bar{
        width: 100%;
        height: 60px;
        background: #009494;
        .logo-img{
          margin-left: 25px;
        }
        .header-info{
          margin: 20px;
          float: right;
          color:#fff;
          .cut-line{
            display: inline-block;
            height: 12px;
            border-left: 1px solid #fff;
            margin: 0 10px;
          }
          .logout, .change-password{
            cursor: pointer;
          }
        }
      }
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
</style>
