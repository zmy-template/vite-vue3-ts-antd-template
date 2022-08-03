<script setup lang="ts">
import { ref } from "vue"
import SideMenu from "./side-menu.vue"
import topHeader from "./top-header.vue"
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons-vue"
const collapsed = ref<boolean>(false)
</script>
<template>
  <a-layout style="height: 100vh">
    <a-layout-header class="top-header">
      <top-header />
    </a-layout-header>
    <a-layout>
      <a-layout-sider
        width="200"
        v-model:collapsed="collapsed"
        collapsible
        collapsedWidth="47"
        :trigger="null"
        class="layout-sidebar"
      >
        <side-menu />
        <div
          class="layout-sidebar__collapase-btn"
          @click="() => (collapsed = !collapsed)"
        >
          <MenuUnfoldOutlined v-if="collapsed" />
          <MenuFoldOutlined v-else />
        </div>
      </a-layout-sider>
      <a-layout>
        <a-layout-content style="padding: 24px">
          <router-view />
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>
<style lang="scss">
.top-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  line-height: 48px;
  padding: 0 20px;
}
.layout-sidebar {
  position: relative;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.15);
  &__collapase-btn {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 40px;
    line-height: 40px;
    padding: 0 16px;
    box-shadow: inset 0px 1px 0px #f0f0f0;
    cursor: pointer;
  }
}
.ant-layout-content {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 48px);
  overflow: auto;
}
</style>
