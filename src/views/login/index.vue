<script lang="ts" setup>
import { reactive, ref } from "vue"
import { useRouter } from "vue-router"
import { useUserStore } from "@/store/modules/user"
import { User, Lock, Key, Picture, Loading } from "@element-plus/icons-vue"
import { type FormInstance, FormRules } from "element-plus"
// import { getLoginCodeApi } from "@/api/login"
import { type ILoginRequestData } from "@/api/login/types/login"
import md5 from "md5"
const router = useRouter()
const loginFormRef = ref<FormInstance | null>(null)

/** 登录按钮 Loading */
const loading = ref(false)
/** 验证码图片 URL */
const codeUrl = ref("")
/** 登录表单数据 */
const loginForm: ILoginRequestData = reactive({
  mobile: "13800000000",
  pwd: "123456"
})
/** 登录表单校验规则 */
const loginFormRules: FormRules = {
  mobile: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  pwd: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 16, message: "长度在 8 到 16 个字符", trigger: "blur" }
  ]
}
/** 登录逻辑 */
const handleLogin = () => {
  loginFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      loading.value = true
      useUserStore()
        .login({
          mobile: loginForm.mobile,
          pwd: md5(loginForm.pwd)
        })
        .then(() => {
          router.push({ path: "/roleManage" })
        })
        .catch(() => {
          createCode()
          loginForm.pwd = ""
        })
        .finally(() => {
          loading.value = false
        })
    } else {
      return false
    }
  })
}
/** 创建验证码 */
const createCode = () => {
  // 先清空验证码的输入
  loginForm.code = ""
  // 获取验证码
  codeUrl.value = ""
  // getLoginCodeApi().then((res) => {
  //   codeUrl.value = res.data
  // })
}

/** 初始化验证码 */
createCode()
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <div class="title">
        <img src="@/assets/images/login.png" />
      </div>
      <div class="content">
        <p style="margin-top: 68px; margin-bottom: 32px; font-size: 16px; font-weight: bold">test</p>
        <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" @keyup.enter="handleLogin">
          <el-form-item prop="mobile">
            <el-input
              v-model.trim="loginForm.mobile"
              placeholder="用户名"
              type="text"
              tabindex="1"
              maxlength="11"
              :prefix-icon="User"
              size="large"
            />
          </el-form-item>
          <el-form-item prop="pwd">
            <el-input
              v-model.trim="loginForm.pwd"
              placeholder="密码"
              type="password"
              tabindex="2"
              :prefix-icon="Lock"
              size="large"
              show-password
            />
          </el-form-item>
          <el-button
            :loading="loading"
            type="primary"
            size="large"
            @click.prevent="handleLogin"
            style="margin-top: 74px; background-color: #6386ff"
          >
            登 录
          </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100%;
  .theme-switch {
    position: fixed;
    top: 5%;
    right: 5%;
    cursor: pointer;
  }
  .login-card {
    display: flex;
    width: 800px;
    border-radius: 20px;
    box-shadow: 0 0 10px #dcdfe6;
    background-color: #fff;
    overflow: hidden;
    .title {
      width: 441px;
      height: 437px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #d4ddff;
      img {
        width: 287px;
      }
    }
    .content {
      padding: 20px 50px 50px 50px;
      :deep(.el-input-group__append) {
        padding: 0;
        overflow: hidden;
        .el-image {
          width: 100px;
          height: 40px;
          border-left: 0px;
          user-select: none;
          cursor: pointer;
          text-align: center;
        }
      }
      .el-button {
        width: 100%;
        margin-top: 10px;
      }
    }
  }
}
</style>
