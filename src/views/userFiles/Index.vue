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
            <span style="cursor: pointer; margin-right: 10px; color: #000" @click="showInfo">详情</span>
            <span style="cursor: pointer; margin-right: 10px; color: #000" @click="uploadVisible = true">修改</span>
            <span style="cursor: pointer; margin-right: 10px; color: #ff0000">删除</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="uploadVisible" :title="dialogTitlte" width="40%" :before-close="handleClose">
      <div class="diag-content-wrapper">
        <el-form :model="form" label-width="120px" :rules="rules" ref="formEl">
          <el-form-item label="人员姓名" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="年龄" prop="age">
            <el-input v-model="form.age" />
          </el-form-item>
          <el-form-item label="性别" prop="male">
            <el-radio-group v-model="form.male">
              <el-radio label="男" />
              <el-radio label="女" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="工种" prop="job">
            <el-input v-model="form.job" />
          </el-form-item>
          <el-form-item label="关联项目" prop="projectId">
            <el-button type="primary" @click="itemDialogVisible = true">关联项目</el-button>
          </el-form-item>
          <el-form-item label="身份证号" prop="idCardNo">
            <el-input v-model="form.idCardNo" />
          </el-form-item>
          <el-form-item label="银行卡号" prop="bankCardNo">
            <el-input v-model="form.bankCardNo" />
          </el-form-item>
          <el-form-item label="联系方式" prop="mobile">
            <el-input v-model="form.mobile" maxlength="11" />
          </el-form-item>
          <el-form-item label="体检报告" prop="reportUrl">
            <el-button type="primary">体检报告</el-button>
          </el-form-item>
          <el-form-item label="工资表" prop="payrollFileUrl"> 123 </el-form-item>
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

    <el-dialog v-model="itemDialogVisible" width="40%">
      <div>
        <el-table
          :data="itemTableData"
          style="width: 100%; margin-bottom: 20px"
          row-key="id"
          border
          default-expand-all
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="id" label="id" width="150" />
          <el-table-column prop="projectName" label="项目名称" />
        </el-table>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="itemDialogVisible = false">返回上一步</el-button>
          <el-button type="primary" @click="itemDialogVisible = false" v-if="dialogType == 'info'"> 确定 </el-button>
          <el-button type="primary" @click="saveItemList" v-else> 保存 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue"
import type { FormInstance, FormRules } from "element-plus"
import { getUserFileListApi, addUserFileApi } from "@/api/userFile"
import { getItemListApi } from "@/api/itemList"
import { convertToTree } from "@/utils/formatTree"
onMounted(async () => {
  await getUserFileList()
  let res = (await getItemListApi()).data

  itemTableData.value = convertToTree(res)
})
const getUserFileList = async () => {
  let res = await getUserFileListApi()
}

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
  job: "",
  male: "",
  projectId: [],
  idCardNo: "",
  bankCardNo: "",
  mobile: "",
  reportUrl: "",
  payrollFileUrl: ""
})

const dialogType = ref("add")
const dialogTitlte = "新增/修改/查看成员信息"

const formEl = ref<FormInstance>()

const onSubmit = async () => {
  if (!formEl.value) return
  await formEl.value.validate(async (valid, fields) => {
    if (valid) {
      console.log("submit!")
      console.log(form)

      let obj = {
        ...form,
        age: form.age - 0,
        male: form.male == "男" ? true : false,
        bankCardNo: form.bankCardNo - 0
      }

      await addUserFileApi(obj)
    } else {
      console.log("error submit!", fields)
    }
  })
}
const rules = reactive<FormRules>({
  name: [{ required: true, message: "请输入姓名", trigger: "change" }],
  age: [{ required: true, message: "请输入年龄", trigger: "change" }],
  male: [{ required: true, message: "请选择性别", trigger: "change" }],
  job: [{ required: true, message: "请输入工种", trigger: "change" }],
  projectId: [{ required: true, message: "请选择关联项目", trigger: "change" }],
  idCardNo: [{ required: true, message: "请输入身份证号", trigger: "change" }],
  bankCardNo: [{ required: true, message: "请输入银行卡号", trigger: "change" }],
  mobile: [{ required: true, message: "请输入联系方式", trigger: "change" }]
  // reportUrl: [{ required: true, message: "请上传体检报告", trigger: "change" }],
  // payrollFileUrl: [{ required: true, message: "请上传工资表", trigger: "change" }]
})

const uploadFileVisible = ref(false)

let uploadVisible = ref(false)

const handleClose = () => {
  uploadVisible.value = false
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
  uploadVisible.value = true
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
  uploadVisible.value = true
}

// 关联项目
const itemTableData = ref([])
const itemDialogVisible = ref(false)
let multipleSelection = ref([])
const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val
}

// 保存关联项目
const saveItemList = () => {
  console.log(12300, multipleSelection.value)
  let arr = multipleSelection.value.map((ele) => ele.id)
  form.projectId = arr.join()

  itemDialogVisible.value = false
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
