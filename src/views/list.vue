<script setup lang="ts">
import { onMounted, reactive, computed, ref } from "vue"
import { FormInstance, message } from "ant-design-vue"
import { useRoute } from "vue-router"
import locale from "ant-design-vue/es/date-picker/locale/zh_CN"
import type { Dayjs } from "dayjs"

import { downloadExportExcel } from "@/utils/index"
import { getYdPage, exportYd } from "@/api/rail-transport"
import { getYdPageRequest } from "@/types/rail-transport"

type RangeValue = [Dayjs, Dayjs]

const route = useRoute()
const formRef = ref<FormInstance>()
const formState = reactive<getYdPageRequest>({
  ch: "",
  cyrjs: "",
  dzmc: "",
  fhrmc: "",
  fzmc: "",
  pageNum: 1,
  pageSize: 10,
  tyrjs: "",
  ydhm: "",
  zprqEnd: "",
  zprqStart: "",
  total: 0
})

let tbsj = ref<RangeValue>()
let dataSource = ref([])

const columns = [
  {
    title: "序号",
    dataIndex: "No",
    key: "No"
  },
  {
    title: "发货人",
    dataIndex: "fhrmc",
    key: "fhrmc"
  },
  {
    title: "收货人",
    dataIndex: "shrmc",
    key: "shrmc"
  },
  {
    title: "主车号",
    dataIndex: "zch",
    key: "zch"
  },
  {
    title: "发站名称",
    dataIndex: "fzmc",
    key: "fzmc"
  },
  {
    title: "到站名称",
    dataIndex: "dzdm",
    key: "dzdm"
  },
  {
    title: "置票日期",
    dataIndex: "zprq",
    key: "zprq"
  },
  {
    title: "车种",
    dataIndex: "zcx",
    key: "zcx"
  },
  {
    title: "数据操作",
    dataIndex: "operation",
    key: "operation",
    fixed: "right",
    width: 100
  }
]

const pagination = computed(() => ({
  total: formState.total,
  current: formState.pageNum,
  pageSize: formState.pageSize
}))

const handleTableChange = (pag: { pageSize: number; current: number }) => {
  formState.pageNum = pag.current
  formState.pageSize = pag.pageSize
  getYdPageData()
}

const getYdPageData = async () => {
  if (tbsj.value) {
    formState.zprqStart = tbsj.value[0]
    formState.zprqEnd = tbsj.value[1]
  }
  const resp = await getYdPage(formState)
  if (resp.code === 0) {
    dataSource.value = resp.data.list
    formState.total = resp.data.total
  }
}

const exportExcel = async () => {
  const resp = await exportYd(formState)
  if (resp) {
    downloadExportExcel(resp, "运单导出")
  } else {
    message.error("导出失败")
  }
}

const resetForm = () => {
  formRef.value!.resetFields()
  tbsj.value = undefined
  formState.zprqEnd = ""
  formState.zprqStart = ""
  getYdPageData()
}

onMounted(() => {
  // 处理首页的快捷搜索
  const ch = route.params.ch
  if (ch) {
    formState.ch = ch as string
  }
  getYdPageData()
})
</script>

<template>
  <a-card :bordered="false">
    <a-form
      ref="formRef"
      name="advanced_search"
      class="ant-advanced-search-form"
      :labelCol="{ span: 4, offset: 2 }"
      :model="formState"
    >
      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-item label="车号" name="ch">
            <a-input v-model:value="formState.ch" placeholder="请输入车号" />
          </a-form-item>
        </a-col>

        <a-col :span="8">
          <a-form-item label="发货单位" name="fzmc">
            <a-input
              v-model:value="formState.fzmc"
              placeholder="请输入发货单位"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="运单号" name="ydhm">
            <a-input
              v-model:value="formState.ydhm"
              placeholder="请输入您的运单号"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="日期" name="tbsj">
            <a-range-picker
              v-model:value="tbsj"
              :locale="locale"
              valueFormat="YYYY-MM-DD"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24" style="text-align: right">
          <a-button type="primary" html-type="submit" @click="getYdPageData"
            >查询</a-button
          >
          <a-button style="margin: 0 16px" @click="resetForm">清空</a-button>
          <a-button type="primary" ghost @click="exportExcel"
            >导出结果</a-button
          >
        </a-col>
      </a-row>
    </a-form>
  </a-card>

  <a-card class="mt-24">
    <a-table
      class=""
      :dataSource="dataSource"
      :columns="columns"
      :pagination="pagination"
      size="middle"
      @change="handleTableChange"
      :scroll="{ x: 'max-content' }"
    >
      <template #bodyCell="{ record, column, index }">
        <template v-if="column.dataIndex === 'No'">
          <span>
            {{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}
          </span>
        </template>
        <template v-if="column.dataIndex === 'operation'">
          <router-link
            target="_blank"
            :to="{
              path: '/waybill/detail',
              query: { bizId: record.bizId }
            }"
            >查看</router-link
          >
        </template>
      </template>
    </a-table>
  </a-card>
</template>

<style scoped></style>
