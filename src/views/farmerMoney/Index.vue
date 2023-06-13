<template>
  <div class="my-container">
    <div class="top-serach">
      <div>
        <el-select v-model="value" class="m-2" placeholder="请选择关联项目">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-button style="background-color: #6386ff; color: #fff; border-radius: 10px; padding: 10px 20px"
          >查询</el-button
        >
      </div>
      <el-button
        style="background-color: #6386ff; color: #fff; border-radius: 10px; padding: 10px 20px"
        @click="addNew"
      >
        新增工资
      </el-button>
    </div>

    <div class="table-content">
      <el-table :data="tableData" style="width: 100%" default-expand-all>
        <el-table-column prop="order" label="序号" width="150" />
        <el-table-column prop="name" label="项目名称" />
        <el-table-column label="操作" width="240">
          <template #default>
            <span style="cursor: pointer; margin-right: 10px; color: #000" @click="showInfo"> 详情 </span>
            <span style="cursor: pointer; margin-right: 10px; color: #000" @click="dialogVisible = true">修改 </span>
            <span style="cursor: pointer; margin-right: 10px; color: #ff0000">删除</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="dialogVisible" :title="dialogTitlte" width="30%" :before-close="handleClose">
      <div class="diag-content-wrapper">
        <el-form :model="form" label-width="120px" :rules="rules" ref="formEl">
          <el-form-item label="文件名" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="关联项目" prop="contactItem">
            <el-button type="primary">关联项目</el-button>
          </el-form-item>
          <el-form-item label="上传文件" prop="uploadFile">
            <el-button type="primary">上传文件</el-button>
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
import { ref, reactive } from "vue"
import type { FormInstance, FormRules } from "element-plus"

const value = ref("")

const options = [
  {
    value: "Option1",
    label: "Option1"
  },
  {
    value: "Option2",
    label: "Option2"
  },
  {
    value: "Option3",
    label: "Option3"
  },
  {
    value: "Option4",
    label: "Option4"
  },
  {
    value: "Option5",
    label: "Option5"
  }
]

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

const tableData = [
  {
    order: "1",
    name: "Tom"
  },
  {
    order: "2",
    name: "Tom2"
  }
]

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
