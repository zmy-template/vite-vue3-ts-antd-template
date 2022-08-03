import { defineStore } from "pinia"
import { store } from "./index"
import { router } from "@/router"
import { getUserInfo, loginOut } from "@/api/user"
import { message } from "ant-design-vue"
import { RouteRecordName } from "vue-router"

export type userType = {
  lastLoginTime: string
  name: string
  roleName: string
  perPaths: RouteRecordName[]
}

export const useUserStore = defineStore({
  id: "pure-user",
  state: (): userType => ({
    lastLoginTime: "",
    name: "",
    roleName: "",
    perPaths: []
  }),
  actions: {
    SET_LAST_LOGIN_TIME(lastLoginTime: string) {
      this.lastLoginTime = lastLoginTime
    },
    SET_NAME(name: string) {
      this.name = name
    },
    SET_ROLE_NAME(roleName: string) {
      this.roleName = roleName
    },
    SET_PER_PATHS(path: []) {
      this.perPaths = path
    },
    // 获取用户信息
    async getUserInfoData() {
      // 用户信息存储在localStorge
      const resp = await getUserInfo()
      if (resp?.code === 0) {
        const { lastLoginTime, name, roleName, perPaths } = resp.data
        localStorage.setItem(
          "auth",
          JSON.stringify({ lastLoginTime, name, roleName, perPaths })
        )
      }
    },
    // 登出 清空缓存
    async logOut() {
      if (!getAuth()) return
      const resp = await loginOut()
      if (resp.code === 20000) {
        router.push("/login")
        removeAuth()
      } else {
        message.error(resp.msg)
      }
    }
  }
})

export function getAuth() {
  return localStorage.getItem("auth")
}

export function setAuth() {
  if (!getAuth()) return
  const { lastLoginTime, name, roleName, perPaths } = JSON.parse(
    localStorage.getItem("auth") as string
  )
  useUserStoreHook().SET_LAST_LOGIN_TIME(lastLoginTime)
  useUserStoreHook().SET_NAME(name)
  useUserStoreHook().SET_ROLE_NAME(roleName)
  useUserStoreHook().SET_PER_PATHS(perPaths)
}

export function removeAuth() {
  useUserStoreHook().SET_LAST_LOGIN_TIME("")
  useUserStoreHook().SET_NAME("")
  useUserStoreHook().SET_ROLE_NAME("")
  useUserStoreHook().SET_PER_PATHS([])
  localStorage.removeItem("auth")
}

export function useUserStoreHook() {
  return useUserStore(store)
}
