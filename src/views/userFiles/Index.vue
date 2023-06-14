<template>
  <div class="my-container">
    <div class="top-serach">
      <div>
        <el-select v-model="searchParams.item" class="m-2" placeholder="请选择关联项目">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-input v-model="searchParams.name" placeholder="请输入成员姓名" />
        <el-input v-model="searchParams.phone" placeholder="请输入成员手机号" />
        <el-button style="background-color: #6386ff; color: #fff; border-radius: 10px; padding: 10px 20px"
          >查询</el-button
        >
      </div>
      <div>
        <el-button
          style="background-color: #6386ff; color: #fff; border-radius: 10px; padding: 10px 20px"
          @click="uploadManyFiles"
        >
          批量上传
        </el-button>
        <el-button
          style="background-color: #6386ff; color: #fff; border-radius: 10px; padding: 10px 20px"
          @click="addNew"
        >
          新增人员
        </el-button>
      </div>
    </div>

    <div class="table-content">
      <el-table :data="tableData" style="width: 100%" default-expand-all>
        <el-table-column prop="order" label="序号" width="150" />
        <el-table-column prop="name" label="项目名称" />
        <el-table-column label="操作" width="240">
          <template #default>
            <span style="cursor: pointer; margin-right: 10px; color: #6386ff" @click="uploadReport">上传报告</span>
            <span style="cursor: pointer; margin-right: 10px; color: #000" @click="showInfo">新增下级</span>
            <span style="cursor: pointer; margin-right: 10px; color: #000" @click="dialogVisible = true">修改</span>
            <span style="cursor: pointer; margin-right: 10px; color: #ff0000">删除</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="dialogVisible" :title="dialogTitlte" width="40%" :before-close="handleClose">
      <div class="diag-content-wrapper">
        <el-form :model="form" label-width="120px" :rules="rules" ref="formEl">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="form.phone" />
            <p style="color: #b1b1b1; margin: 0">密码默认：123456</p>
          </el-form-item>
          <el-form-item label="关联项目" prop="contactItem">
            <el-button type="primary">关联项目</el-button>
          </el-form-item>
          <el-form-item label="角色" prop="role">
            <el-input v-model="form.role" />
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
    <el-dialog v-model="uploadVisible" :title="dialogTitlte" width="40%" :before-close="handleClose">
      <div class="diag-content-wrapper">
        <el-form :model="form" label-width="120px" :rules="rules" ref="formEl">
          <el-form-item label="人员姓名" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="年龄" prop="age">
            <el-input v-model="form.age" />
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="form.gender">
              <el-radio label="男女" />
              <el-radio label="女" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="工种" prop="kind">
            <el-input v-model="form.kind" />
          </el-form-item>
          <el-form-item label="关联项目" prop="contactItem">
            <el-button type="primary">关联项目</el-button>
          </el-form-item>
          <el-form-item label="身份证号" prop="idCard">
            <el-input v-model="form.idCard" />
          </el-form-item>
          <el-form-item label="银行卡号" prop="cardNum">
            <el-input v-model="form.cardNum" />
          </el-form-item>
          <el-form-item label="联系方式" prop="phone">
            <el-input v-model="form.cardNum" />
          </el-form-item>
          <el-form-item label="体检报告" prop="medicalReport">
            <el-button type="primary">体检报告</el-button>
          </el-form-item>
          <el-form-item label="工资表" prop="payroll"> 123 </el-form-item>
          <el-form-item>
            <div style="text-align: center; width: 80%">
              <el-button>取 消</el-button>
              <el-button type="primary" @click="onSubmit">保 存</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

    <el-dialog v-model="uploadFileVisible" :title="uploadText" width="40%" :before-close="handleClose">
      <div class="diag-content-wrapper">
        <el-upload
          class="upload-demo"
          drag
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          multiple
        >
          <p>点击如下按钮上传文件</p>
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
          <template #tip>
            <div class="el-upload__tip">jpg/png files with a size less than 500kb</div>
          </template>
        </el-upload>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue"
import type { FormInstance, FormRules } from "element-plus"

const searchParams = ref({
  name: "",
  phone: "",
  item: ""
})

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
  age: "",
  kind: "",
  gender: "",
  contactItem: [],
  idCard: "",
  cardNum: "",
  phone: ""
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
  age: [{ required: true, message: "请输入年龄", trigger: "change" }],
  kind: [{ required: true, message: "请输入年龄", trigger: "change" }],
  gender: [{ required: true, message: "请输入性别", trigger: "change" }],
  contactItem: [{ required: true, message: "请输入性别", trigger: "change" }],
  idCard: [{ required: true, message: "请输入性别", trigger: "change" }],
  cardNum: [{ required: true, message: "请输入性别", trigger: "change" }],
  phone: [{ required: true, message: "请输入性别", trigger: "change" }],
  medicalReport: [{ required: true, message: "请输入性别", trigger: "change" }],
  payroll: [{ required: true, message: "请输入性别", trigger: "change" }]
})

const dialogVisible = ref(false)

const uploadFileVisible = ref(false)

const uploadVisible = ref(false)

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

const uploadText = ref("批量上传")

const addNew = () => {
  dialogType.value = "add"
  dialogVisible.value = true
}

const uploadManyFiles = () => {
  uploadText.value = "批量上传"
  uploadFileVisible.value = true
}

const uploadReport = () => {
  uploadText.value = "上传报告"
  uploadFileVisible.value = true
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
