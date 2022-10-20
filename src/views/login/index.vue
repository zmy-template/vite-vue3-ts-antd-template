<template>
  <div class="login-wrapper">
    <div class="login-box">
      <div class="login-form-box">
        <h3 class="login-product-name">物流信息平台</h3>
        <p class="login-welcome">欢迎使用物流信息平台！</p>
        <a-form
          :model="formState"
          name="normal_login"
          :rules="rules"
          @finish="onFinish"
          @finishFailed="onFinishFailed"
        >
          <a-form-item name="phoneNumber">
            <a-input
              v-model:value="formState.phoneNumber"
              placeholder="手机号码"
              size="large"
            >
              <template #prefix>
                <mobile-outlined class="login-input-icon" />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item name="code">
            <a-row :gutter="0">
              <a-col :span="16">
                <a-input
                  v-model:value="formState.code"
                  placeholder="验证码"
                  size="large"
                >
                  <template #prefix>
                    <lock-outlined class="login-input-icon" />
                  </template>
                </a-input>
              </a-col>
              <a-col :span="8">
                <a-button
                  :disabled="!validatePhoneCorrect || disabledCodeBtn"
                  type="primary"
                  size="large"
                  style="margin-left: 16px"
                  @click="sendVerifyCode(formState)"
                  >{{ codeText }}</a-button
                >
              </a-col>
            </a-row>
          </a-form-item>

          <a-form-item>
            <a-button
              :disabled="disabled"
              type="primary"
              block
              size="large"
              html-type="submit"
              class="login-form-button"
            >
              登录
            </a-button>
          </a-form-item>
        </a-form>

        <FormProvider :form="form">
          <Field name="input" :component="[Input, { placeholder: '请输入' }]" />
        </FormProvider>
      </div>
    </div>
  </div>
  <div class="login-copyright">Copyright © 2022-2090</div>
</template>

<script setup lang="ts">
import { reactive, computed } from "vue"
import type { Rule } from "ant-design-vue/es/form"
import { MobileOutlined, LockOutlined } from "@ant-design/icons-vue"
import { useRouter } from "vue-router"
import {
  codeText,
  disabledCodeBtn,
  sendVerifyCode,
  stopCount
} from "./verifycode"
import { login } from "@/api/user"
import { useUserStoreHook } from "@/store/user"

import { createForm } from "@formily/core"
import { FormProvider, Field } from "@formily/vue"

const form = createForm()

interface FormState {
  phoneNumber: string
  code: string
}
const userStore = useUserStoreHook()
const router = useRouter()
const formState = reactive<FormState>({
  phoneNumber: "",
  code: ""
})
var validatePhone = (rule: Rule, value: string) => {
  if (!/^1[3|4|5|7|8]\d{9}$/.test(value)) {
    return Promise.reject("格式有误")
  } else {
    return Promise.resolve()
  }
}
const rules: Record<string, Rule[]> = {
  phoneNumber: [
    {
      required: true,
      message: "请输入用户电话号码",
      trigger: "blur"
    },
    {
      validator: validatePhone,
      trigger: "change"
    }
  ],
  code: [
    {
      required: true,
      message: "请输入验证码",
      trigger: "change"
    },
    {
      min: 6,
      max: 6,
      message: "请输入6位验证码",
      trigger: "change"
    }
  ]
}
const onFinish = async (values: any) => {
  console.log("Success:", values)
  let resp = await login(values)
  if (resp.code === 0) {
    console.log(resp)
    stopCount()
    await userStore.getUserInfoData()
    router.push({
      name: "home"
    })
  }
}

const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo)
}
const validatePhoneCorrect = computed(() => {
  return !!(
    formState.phoneNumber && /^1[3|4|5|7|8]\d{9}$/.test(formState.phoneNumber)
  )
})
const disabled = computed(() => {
  return !(formState.phoneNumber && formState.code)
})
</script>

<style>
.login-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background-image: url("@/assets/login-bg.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.login-box {
  display: flex;
  align-items: center;
  width: 1000px;
  height: 640px;
  background-color: #fff;
  background-image: url("@/assets/login-banner.png");
  background-position: left center;
  background-repeat: no-repeat;
  background-size: auto 100%;
  border-radius: 28px;
  padding-left: 500px;
}
.login-copyright {
  position: absolute;
  bottom: 20px;
  width: 100vw;
  font-weight: 400;
  font-size: 14px;
  text-align: center;
  color: rgba(0, 0, 0, 0.25);
}

.login-form-box {
  padding: 0 50px;
}
.login-product-name {
  font-weight: 700;
  font-size: 38px;
  line-height: 54px;
  letter-spacing: 2px;
  color: #434343;
  margin-bottom: 16px;
}
.login-welcome {
  font-size: 16px;
  line-height: 24px;
  margin-bottom: 36px;
  color: rgba(0, 0, 0, 0.45);
}
.login-input-icon {
  color: var(--ant-primary-color);
}
</style>
