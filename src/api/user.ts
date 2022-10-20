import { http } from "@/utils/http"
import { resultType } from "@/utils/http/types"

export const login = (data: { phoneNumber: string; code: string }) => {
  const params = {
    phone: data.phoneNumber,
    type: "front",
    verifyCode: data.code
  }
  return http.post<unknown, resultType>("/login", { params })
}

export const sendLoginSms = (phoneNumber: string) => {
  const params = {
    phone: phoneNumber
  }
  return http.post<unknown, resultType>("/sendLoginSms", { params })
}

export const getUserInfo = () => {
  return http.get<unknown, resultType>("/getCurrentUser")
}

export const loginOut = () => {
  return http.post<unknown, resultType>("/logout")
}

export const getYdPage = (data: any) => {
  return http.post<unknown, resultType>(`/rail/transport/getYdPage`, { data })
}
