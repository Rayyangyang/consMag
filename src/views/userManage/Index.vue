<template>
  <div class="my-container">
    <div class="top-serach">
      <div>
        <el-input v-model="searchParams.name" placeholder="请输入成员姓名" />
        <el-input v-model="searchParams.phone" placeholder="请输入成员手机号" />
        <el-button style="background-color: #6386ff; color: #fff; border-radius: 10px; padding: 10px 20px"
          >查询</el-button
        >
      </div>
      <el-button style="background-color: #6386ff; color: #fff; border-radius: 10px; padding: 10px 20px"
        >新增</el-button
      >
    </div>

    <div class="table-content">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="order" label="序号" width="150" />
        <el-table-column prop="name" label="成员姓名" />
        <el-table-column prop="state" label="手机号" />
        <el-table-column prop="city" label="角色" />
        <el-table-column label="操作">
          <template #default>
            <el-button link type="primary" size="small" @click="handleClick">Detail</el-button>
            <el-button link type="primary" size="small">Edit</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"

const searchParams = ref({
  name: "",
  phone: ""
})

const tableData = [
  {
    date: "2016-05-03",
    name: "Tom",
    state: "California",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036",
    tag: "Home"
  },
  {
    date: "2016-05-02",
    name: "Tom",
    state: "California",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036",
    tag: "Office"
  }
]
</script>

<style scoped lang="scss">
.my-container {
  padding: 20px;
  background-color: #fff;
}
.top-serach {
  display: flex;
  justify-content: space-between;
  > div {
    display: flex;
    .el-input {
      width: 208px;
      margin-right: 20px;
    }
  }
}
.table-content {
  margin-top: 20px;
}
</style>
