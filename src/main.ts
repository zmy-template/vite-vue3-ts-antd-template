import "ant-design-vue/lib/message/style/index.css"
import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import { setupStore } from "./store"

const app = createApp(App)
import "./style/index.scss"
// 注册路由
app.use(router)
// 注册store
setupStore(app)
app.mount("#app")
