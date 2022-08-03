import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { resolve } from "path"
import Components from "unplugin-vue-components/vite"
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers"
import svgLoader from "vite-svg-loader"

// 路径查找
const pathResolve = (dir: string): string => {
  return resolve(__dirname, ".", dir)
}

// 设置别名
const alias: Record<string, string> = {
  "@": pathResolve("src")
}

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias
  },
  plugins: [
    vue(),
    Components({
      resolvers: [AntDesignVueResolver()]
    }),
    // svg组件化支持
    svgLoader()
  ],
  server: {
    host: "0.0.0.0",
    proxy: {
      "/api": {
        target: "http://121.37.81.28:8080/",
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, "")
      }
    }
  }
})
