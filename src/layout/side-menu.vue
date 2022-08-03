<script setup lang="ts">
import { onMounted, ref } from "vue"
import { useRoute } from "vue-router"
import generateRoutes from "@/router/modules/generate"
import { Icon } from "../components/icon"
import { useUserStoreHook } from "@/store/user"
const route = useRoute()
const userStore = useUserStoreHook()
const menuData = generateRoutes.children
const openKeys = ref<string[]>([])
const rootSubmenuKeys = ref<string[]>(["demand", "time", "freight"])
const onOpenChange = (keys: string[]) => {
  const latestOpenKey = keys.find(key => openKeys.value.indexOf(key) === -1)
  if (rootSubmenuKeys.value.indexOf(latestOpenKey!) === -1) {
    openKeys.value = keys
  } else {
    openKeys.value = latestOpenKey ? [latestOpenKey] : []
  }
}
const initOPenKey = () => {
  const initKey = rootSubmenuKeys.value.find(item =>
    route.fullPath.includes(item)
  )
  if (!initKey) return
  openKeys.value = [initKey]
}
onMounted(() => {
  initOPenKey()
})
</script>
<template>
  <a-menu
    v-if="menuData && menuData.length > 0"
    :open-keys="openKeys"
    :selectedKeys="[route.name]"
    mode="inline"
    @openChange="onOpenChange"
    :style="{ height: '100%', borderRight: 0 }"
  >
    <template v-for="menuItem in menuData">
      <a-sub-menu
        v-if="
          menuItem.children &&
          !menuItem.meta?.hidden &&
          userStore.perPaths.includes(menuItem.name || '')
        "
        :key="menuItem.name"
      >
        <template #title>
          <Icon :icon="menuItem.meta?.icon" />
          <span>{{ menuItem.meta?.title }} </span>
        </template>
        <template
          v-for="subMenuItem in menuItem.children"
          :key="subMenuItem.name"
        >
          <a-menu-item
            v-if="userStore.perPaths.includes(subMenuItem.name || '')"
            :key="subMenuItem.name"
          >
            <router-link :to="subMenuItem.path">{{
              subMenuItem.meta?.title
            }}</router-link>
          </a-menu-item>
        </template>
      </a-sub-menu>
      <a-menu-item
        v-if="
          !menuItem.children &&
          !menuItem.meta?.hidden &&
          userStore.perPaths.includes(menuItem.name || '')
        "
        :key="menuItem.name"
      >
        <router-link :to="menuItem.path">
          <Icon :icon="menuItem.meta?.icon" />
          <span>{{ menuItem.meta?.title }}</span>
        </router-link>
      </a-menu-item>
    </template>
  </a-menu>
</template>

<style></style>
