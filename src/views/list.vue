<script setup lang="ts">
import crud, { defineR } from "crud-vue"

import { getYdPage } from "@/api/user"
const primaryKey = "id"
const r = defineR({
  columns: [
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
  ],

  async done() {
    const { data } = await getYdPage({})
    return { list: data.list, total: data.total }
  }
})
</script>

<template>
  <crud :primaryKey="primaryKey" :r="r" />
</template>
