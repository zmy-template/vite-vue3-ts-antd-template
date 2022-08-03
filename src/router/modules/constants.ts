import type { RouteRecordRaw } from "vue-router"

const route: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      title: "登陆"
    }
  }
]

export default route
