<script setup lang="ts">
import { onMounted, ref } from "vue"
import { BellOutlined, LogoutOutlined } from "@ant-design/icons-vue"
import { useUserStoreHook, setAuth } from "@/store/user"
import { getUnReadCount } from "@/api/user"
const userStore = useUserStoreHook()
const unReadMessageCount = ref(0)
const getUnReadNum = async () => {
  const resp = await getUnReadCount()
  if (resp?.code === 0) {
    unReadMessageCount.value = resp.data
  }
}
onMounted(() => {
  getUnReadNum()
  setAuth()
})
</script>
<template>
  <a href="" class="logo"
    ><img src="@/assets/logo.png" style="width: 160px"
  /></a>
  <div class="top-header__right">
    <a-button type="primary"
      ><router-link to="/dashboard" target="_blank"
        >运营可视化</router-link
      ></a-button
    >
    <span class="top-header__last-login-time"
      >上次登录时间：{{ userStore.lastLoginTime }}</span
    >
    <a-badge :count="unReadMessageCount" class="top-header__message">
      <router-link to="/message"
        ><bell-outlined style="color: #fff; font-size: 16px"
      /></router-link>
    </a-badge>
    <span class="top-header__user-name">{{ userStore.name }}</span>
    <div class="top-header__avastar">
      <a-avatar
        class="top-header__avastar-img"
        style="background-color: #f56a00"
      >
        {{ userStore.name.substr(0, 1) }}
      </a-avatar>
      <span class="top-header__avastar-role">{{ userStore.roleName }}</span>
    </div>
    <logout-outlined
      class="top-header__logout"
      @click="userStore.logOut()"
      style="color: #fff; font-size: 16px; margin-left: 30px; margin-right: 8px"
    />
  </div>
</template>

<style lang="scss">
.top-header {
  &__right {
    display: flex;
    align-items: center;
  }
  &__last-login-time {
    margin-left: 24px;
    color: rgba(255, 255, 255, 0.8);
  }
  &__message {
    margin-left: 29px;
    .ant-badge-count {
      transform: translate(80%, -50%);
    }
  }
  &__user-name {
    color: #fff;
    font-weight: 500;
    margin-left: 30px;
  }
  &__avastar {
    margin-left: 8px;
    .ant-avatar-circle {
      border: 2px solid #fff;
      line-height: 30px;
    }
    &-role {
      display: inline-block;
      vertical-align: middle;
      height: 24px;
      line-height: 24px;
      color: rgba(0, 0, 0, 0.85);
      padding: 0 10px 0 24px;
      border-radius: 18px;
      font-size: 12px;
      background: rgba(255, 255, 255, 0.85);
      margin-left: -18px;
    }
  }
}
</style>
