import {
  Router,
  createRouter,
  createWebHistory,
  createWebHashHistory
} from "vue-router"
import constantsRoute from "./modules/constants"
import nProgress from "../utils/progress"
import { getAuth, removeAuth } from "@/store/user"

const routes = [...constantsRoute]

export const router: Router = createRouter({
  history: createWebHistory(), // createWebHashHistory()
  routes: routes,
  strict: true,
  scrollBehavior(to, from, savedPosition) {
    return new Promise(resolve => {
      if (savedPosition) {
        return savedPosition
      } else {
        if (from.meta.saveSrollTop) {
          const top: number =
            document.documentElement.scrollTop || document.body.scrollTop
          resolve({ left: 0, top })
        }
      }
    })
  }
})

router.beforeEach((to, from, next) => {
  nProgress.start()
  // if (to.path !== "/login" && !getAuth()) {
  //   next("/login")
  // }
  // if (to.path === "/login") {
  //   removeAuth()
  // }
  next()
})

router.afterEach((to, from) => {
  nProgress.done()
})

export default router
