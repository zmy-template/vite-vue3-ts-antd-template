import type { RouteRecordRaw } from "vue-router"

const route: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      title: "登陆"
    }
  },
  {
    path: "/list",
    name: "list",
    component: () => import("@/views/list.vue"),
    meta: {
      title: "列表"
    }
  }
]

export default route
