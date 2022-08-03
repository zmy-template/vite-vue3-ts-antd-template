import { ref } from "vue"
import { sendLoginSms } from "@/api/user"
import { message } from "ant-design-vue"

let timer: any = ref(null)
const codeText = ref("获取验证码")
const disabledCodeBtn = ref(false)
const COUNTDOWNNUM = 60

// 校验码计时器
const countDown = (time: number) => {
  if (time === 0) {
    stopCount()
  } else {
    disabledCodeBtn.value = true
    codeText.value = "重发(" + time + ")"
    time--
    timer = setTimeout(() => {
      countDown(time)
    }, 1000)
  }
}

const stopCount = () => {
  clearTimeout(timer)
  timer = null
  disabledCodeBtn.value = false
  codeText.value = "获取验证码"
}

// 发送校验码
const sendVerifyCode = async (formState: {
  phoneNumber: string
  code: string
}) => {
  if (
    !formState.phoneNumber ||
    !/^1[3|4|5|7|8]\d{9}$/.test(formState.phoneNumber)
  ) {
    message.warning("请输入正确的手机号码！")
    return
  }
  const resp = await sendLoginSms(formState.phoneNumber)
  if (resp.code === 0) {
    countDown(COUNTDOWNNUM)
  }
}

export { codeText, disabledCodeBtn, sendVerifyCode, stopCount }
