import Axios, { AxiosInstance, AxiosRequestConfig } from "axios"
import {
  PureHttpError,
  RequestMethods,
  PureHttpResponse,
  PureHttpRequestConfig
} from "./types.d"
import qs from "qs"
import NProgress from "../progress"
import { message } from "ant-design-vue"
import { useUserStoreHook } from "@/store/user"

const loadEnv = () => {
  return import.meta.env
}

// 加载环境变量 VITE_PROXY_DOMAIN（开发环境）  VITE_PROXY_DOMAIN_REAL（打包后的线上环境）
const { VITE_PROXY_DOMAIN, VITE_PROXY_DOMAIN_REAL } = loadEnv()

// 相关配置请参考：www.axios-js.com/zh-cn/docs/#axios-request-config-1
const defaultConfig: AxiosRequestConfig = {
  baseURL:
    process.env.NODE_ENV === "production"
      ? VITE_PROXY_DOMAIN_REAL
      : VITE_PROXY_DOMAIN,
  // 当前使用mock模拟请求，将baseURL制空，如果你的环境用到了http请求，请删除下面的baseURL启用上面的baseURL，并将11行、16行代码注释取消
  // baseURL: "/api",
  timeout: 10000,
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest"
  }
  // withCredentials: true
  // 数组格式参数序列化
  // paramsSerializer: params => qs.stringify(params, { indices: false })
}

class PureHttp {
  constructor() {
    this.httpInterceptorsRequest()
    this.httpInterceptorsResponse()
  }
  // 初始化配置对象
  private static initConfig: PureHttpRequestConfig = {}

  // 保存当前Axios实例对象
  private static axiosInstance: AxiosInstance = Axios.create(defaultConfig)
  private interfaceTimeOut = false
  // 请求拦截
  private httpInterceptorsRequest(): void {
    PureHttp.axiosInstance.interceptors.request.use(
      (config: PureHttpRequestConfig) => {
        const $config = config
        // 开启进度条动画
        NProgress.start()
        // 优先判断post/get等方法是否传入回掉，否则执行初始化设置等回掉
        if (typeof config.beforeRequestCallback === "function") {
          config.beforeRequestCallback($config)
          return $config
        }
        if (PureHttp.initConfig.beforeRequestCallback) {
          PureHttp.initConfig.beforeRequestCallback($config)
          return $config
        }
        // const token = "1234567" //getToken()
        // if (token) {
        //   const data = JSON.parse(token)
        //   config.headers["Authorization"] = "Bearer " + data.accessToken
        //   return $config
        // } else {
        //   return $config
        // }
        return $config
      },
      error => {
        return Promise.reject(error)
      }
    )
  }

  // 响应拦截
  private httpInterceptorsResponse(): void {
    const instance = PureHttp.axiosInstance
    instance.interceptors.response.use(
      (response: PureHttpResponse) => {
        const $config = response.config
        // 关闭进度条动画
        NProgress.done()
        // 优先判断post/get等方法是否传入回掉，否则执行初始化设置等回掉
        if (typeof $config.beforeResponseCallback === "function") {
          $config.beforeResponseCallback(response)
          return response.data
        }
        if (PureHttp.initConfig.beforeResponseCallback) {
          PureHttp.initConfig.beforeResponseCallback(response)
          return response.data
        }
        // 登录超时
        if (response.data.code === 10010 && !this.interfaceTimeOut) {
          this.interfaceTimeOut = true
          const userStore = useUserStoreHook()
          userStore.logOut()
          message.error(response.data.msg)
        }
        // 统一错误信息提示
        if (response.data.code !== 0 && response.data.code !== 10010) {
          message.error(response.data.msg)
        }
        return response.data
      },
      (error: PureHttpError) => {
        const $error = error
        $error.isCancelRequest = Axios.isCancel($error)
        // 关闭进度条动画
        NProgress.done()
        // 所有的响应异常 区分来源为取消请求/非取消请求
        return Promise.reject($error)
      }
    )
  }

  // 通用请求工具函数
  public request<T>(
    method: RequestMethods,
    url: string,
    param?: AxiosRequestConfig,
    axiosConfig?: PureHttpRequestConfig
  ): Promise<T> {
    const config = {
      method,
      url,
      ...param,
      ...axiosConfig
    } as PureHttpRequestConfig

    // 单独处理自定义请求/响应回掉
    return new Promise((resolve, reject) => {
      PureHttp.axiosInstance
        .request(config)
        .then((response: any) => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  // 单独抽离的post工具函数
  public post<T, P>(
    url: string,
    params?: T,
    config?: PureHttpRequestConfig
  ): Promise<P> {
    return this.request<P>("post", url, params, config)
  }

  // 单独抽离的get工具函数
  public get<T, P>(
    url: string,
    params?: T,
    config?: PureHttpRequestConfig
  ): Promise<P> {
    return this.request<P>("get", url, params, config)
  }
}

export const http = new PureHttp()
