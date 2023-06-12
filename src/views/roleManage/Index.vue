<template>
  <div class="my-container">
    <div class="left-tree">
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px 20px 0">
        <span style="font-weight: bold"> 角色 </span>
        <span style="color: #6386ff; cursor: pointer" @click="addNewRole">+ 新增角色</span>
      </div>
      <div class="role-list">
        <div
          v-for="(ele, i) in roleList"
          :key="ele.title"
          style="display: flex; justify-content: space-between; line-height: 40px"
          @click="curI = i"
          :class="curI == i ? 'active-role' : ''"
        >
          <span>
            {{ ele.title }}
          </span>
          <div v-show="curI == i">
            <el-icon style="color: #6386ff; font-weight: bold; font-size: 16px; margin-right: 10px; cursor: pointer"
              ><Edit
            /></el-icon>
            <el-icon style="color: #6386ff; font-weight: bold; font-size: 16px; cursor: pointer"><Delete /></el-icon>
          </div>
        </div>
      </div>
    </div>
    <div class="right-content">2</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"

const roleList = ref([
  {
    title: "test"
  },
  {
    title: "any"
  },
  {
    title: "te123st"
  }
])

const curI = ref(0)

const addNewRole = () => {}
</script>

<style lang="scss" scoped>
.my-container {
  display: flex;
}
.left-tree {
  width: 320px;
  background-color: #fff;
  margin-right: 20px;
}
.right-content {
  flex: 1;
  background-color: #fff;
  padding: 20px;
}
.role-list {
  margin-top: 20px;
  > div {
    padding: 0 16px;
  }
}
.active-role {
  background-color: #d4ddff;
}
</style>
