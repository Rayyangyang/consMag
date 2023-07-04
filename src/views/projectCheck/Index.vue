<template>
  <div class="my-container">
    <div class="top-serach">
      <div>
        <el-cascader :options="itemTableData" :props="props" v-model="cascaderVal" style="margin-right: 20px" />
        <el-button style="background-color: #6386ff; color: #fff; border-radius: 10px; padding: 10px 20px"
        @click='getItemList'
          >查询</el-button
        >
      </div>
      <el-button
        style="background-color: #6386ff; color: #fff; border-radius: 10px; padding: 10px 20px"
        @click="addNew"
      >
        导出
      </el-button>
    </div>

    <div class="table-content">
      <el-table :data="tableData" style="width: 100%" default-expand-all>
        <el-table-column prop="order" label="序号" width="150" />
        <el-table-column prop="name" label="一级目录名称" />
        <el-table-column prop="name" label="二级目录名称" />
        <el-table-column prop="projectType" label="检查类型" />
        <el-table-column prop="creatorName" label="人员姓名" />
        <el-table-column prop="content" label="检查结果" />
        <el-table-column prop="status" label="整改情况" />
        <el-table-column prop="createTime" label="上传时间" />
        <el-table-column label="操作" width="110">
          <template #default>
            <span style="cursor: pointer; margin-right: 10px; color: #000" @click="showInfo"> 详情 </span>
            <span style="cursor: pointer; margin-right: 10px; color: #000" @click="dialogVisible = true">修改 </span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="dialogVisible" :title="dialogTitlte" width="30%" :before-close="handleClose">
      <div class="diag-content-wrapper">
        <el-form :model="form" label-width="120px" :rules="rules" ref="formEl">
          <el-form-item label="项目类型" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="关联项目" prop="contactItem">
            <el-button type="primary">关联项目</el-button>
          </el-form-item>
          <el-form-item label="检查内容" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="问题描述" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="检查图片" prop="uploadFile" />
          <el-form-item label="检查结果" prop="gender">
            <el-radio-group v-model="form.gender">
              <el-radio label="合格" />
              <el-radio label="不合格" />
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <div style="text-align: center; width: 80%">
              <el-button>取 消</el-button>
              <el-button type="primary" @click="onSubmit">保 存</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue"
import type { FormInstance, FormRules } from "element-plus"
import { getProjectListApi } from "@/api/projectCheck"
import { getItemListApi } from "@/api/itemList"
import { convertToTree } from "@/utils/formatTree"

onMounted(async () => {
  await getItemList()
  let res = (await getItemListApi()).data

  itemTableData.value = convertToTree(res)
})

const searchParams = ref({
  projectIds: []
})

let tableData = ref([])
let cascaderVal = ref([])
const getItemList = async () => {
  let arr = cascaderVal.value.map((ele) => {
    if (ele.length > 1) {
      return ele[1]
    } else {
      return ele
    }
  })
  const projectids = arr.join()

  let res = await getProjectListApi(projectids)
  tableData.value = res.data.list.map((ele, i) => {
    return {
      ...ele,
      order: i + 1
    }
  })
}

// 查询
const itemTableData = ref([])
const props = {
  multiple: true,
  value: "id",
  label: "projectName"
}

const form = reactive({
  name: "",
  contactItem: [],
  uploadFile: ""
})

const dialogType = ref("add")
const dialogTitlte = "新增/修改/查看成员信息"

const formEl = ref<FormInstance>()

const onSubmit = async () => {
  if (!formEl.value) return
  await formEl.value.validate((valid, fields) => {
    if (valid) {
      console.log("submit!")
    } else {
      console.log("error submit!", fields)
    }
  })
}
const rules = reactive<FormRules>({
  name: [{ required: true, message: "请输入姓名", trigger: "change" }],
  uploadFile: [
    {
      required: true,
      message: "请输入正确的手机号",
      trigger: "change"
    }
  ],
  role: [{ required: true, message: "请输入角色", trigger: "change" }]
})

const dialogVisible = ref(false)

const handleClose = () => {
  dialogVisible.value = false
}

const addNew = () => {
  dialogType.value = "add"
  dialogVisible.value = true
}
const showInfo = () => {
  dialogType.value = "info"
  dialogVisible.value = true
}
</script>

<style scoped lang="scss">
.my-container {
  padding: 20px;
  background-color: #fff;
}
.top-serach {
  display: flex;
  justify-content: space-between;
  align-items: center;
  > div {
    display: flex;
    align-items: center;
    .el-input {
      width: 208px;
      margin-right: 20px;
    }
  }
}
.table-content {
  margin-top: 20px;
}

.diag-content-wrapper {
  padding: 20px;
}
</style>
