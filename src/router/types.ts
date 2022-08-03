export type routeMetaType = {
  title: string
  icon?: string
  hidden?: boolean
}

export type RouteConfigs = {
  path: string
  meta: routeMetaType
  children: RouteConfigs[]
  name: string
}
