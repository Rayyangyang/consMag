<template>
  <div class="my-container">
    <div class="top-serach">
      <div>
        <el-cascader :options="itemTableData" :props="props" v-model="cascaderVal" style="margin-right: 20px" />
        <el-input v-model="searchParams.name" placeholder="请输入成员姓名" />
        <el-input v-model="searchParams.mobile" placeholder="请输入成员手机号" :maxlength="11" />
        <el-button
          style="background-color: #6386ff; color: #fff; border-radius: 10px; padding: 10px 20px"
          @click="getUserFileList"
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
        <el-table-column prop="order" label="序号" width="60" />
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="projectName" label="项目名称" />
        <el-table-column prop="male" label="性别" width="60" />
        <el-table-column prop="age" label="年龄" width="60" />
        <el-table-column prop="job" label="工种" />

        <el-table-column label="体检报告" width="100">
          <template #default="scope">
            <span v-if="scope.row.reportUrl">已上传</span>
            <span v-else>未上传</span>
          </template>
        </el-table-column>
        <el-table-column prop="mobile" label="联系方式" width="120" />
        <el-table-column prop="bankCardNo" label="银行卡号" />
        <el-table-column label="操作" width="210">
          <template #default="scope">
            <span style="cursor: pointer; margin-right: 10px; color: #6386ff" @click="uploadReport">上传报告</span>
            <span style="cursor: pointer; margin-right: 10px; color: #000" @click="showInfo(scope.row)">详情</span>
            <span style="cursor: pointer; margin-right: 10px; color: #000" @click="edit(scope.row)">修改</span>
            <span style="cursor: pointer; margin-right: 10px; color: #ff0000" @click="delUserFile(scope.row.id)"
              >删除</span
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="uploadVisible" :title="dialogTitlte" width="40%" :before-close="handleClose">
      <div class="diag-content-wrapper">
        <el-form :model="form" label-width="120px" :rules="rules" ref="formEl">
          <el-form-item label="人员姓名" prop="name">
            <el-input v-model="form.name" :disabled="dialogType == 'info'" />
          </el-form-item>
          <el-form-item label="年龄" prop="age">
            <el-input v-model="form.age" :disabled="dialogType == 'info'" />
          </el-form-item>
          <el-form-item label="性别" prop="male">
            <el-radio-group v-model="form.male" :disabled="dialogType == 'info'">
              <el-radio label="男" />
              <el-radio label="女" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="工种" prop="job">
            <el-input v-model="form.job" :disabled="dialogType == 'info'" />
          </el-form-item>
          <el-form-item label="关联项目" prop="projectId">
            <el-button type="primary" @click="itemDialogVisible = true">关联项目</el-button>
          </el-form-item>
          <el-form-item label="身份证号" prop="idCardNo">
            <el-input v-model="form.idCardNo" :disabled="dialogType == 'info'" />
          </el-form-item>
          <el-form-item label="银行卡号" prop="bankCardNo">
            <el-input v-model="form.bankCardNo" :disabled="dialogType == 'info'" />
          </el-form-item>
          <el-form-item label="联系方式" prop="mobile">
            <el-input v-model="form.mobile" maxlength="11" :disabled="dialogType == 'info'" />
          </el-form-item>
          <el-form-item label="体检报告" prop="reportUrl">
            <div
              v-if="dialogType == 'info'"
              style="position: relative; margin: 0; background-color: #e6e6e6; padding: 4px 10px"
              v-for="ele in fileList"
            >
              {{ ele.name }}
            </div>
            <div v-else>
              <el-button type="primary" @click="uploadReport">体检报告</el-button>
              <p
                style="position: relative; margin: 0; background-color: #e6e6e6; padding: 4px 10px; margin-top: 10px"
                v-for="ele in fileList"
              >
                <span style="word-break: break-all; display: inline-block">{{ ele.name }}</span>
                <el-icon
                  style="
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background-color: #474747;
                    color: #fff;
                    border-radius: 50%;
                    font-weight: bold;
                  "
                  @click="delReportFile"
                  ><Close
                /></el-icon>
              </p>
            </div>
          </el-form-item>
          <el-form-item label="工资表" prop="payrollFileUrl"> 123 </el-form-item>
          <el-form-item>
            <div style="text-align: center; width: 80%">
              <el-button @click="uploadVisible = false">取 消</el-button>
              <el-button type="primary" @click="uploadVisible = false" v-if="dialogType == 'info'">确定</el-button>
              <el-button type="primary" @click="onSubmit" v-else>保 存</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

    <el-dialog v-model="uploadFileVisible" :title="uploadText" width="40%" :before-close="handleCloseUpload">
      <div class="diag-content-wrapper">
        <el-upload
          ref="upload"
          v-model:file-list="fileList"
          class="upload-demo"
          drag
          multiple
          action="http://up-cn-east-2.qiniup.com"
          :before-upload="beforeUpload"
          :on-progress="handleProgress"
          :data="uploadData"
        >
          <p>点击如下按钮上传文件</p>
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <template #tip>
            <div class="el-upload__tip" style="text-align: center; margin-bottom: 20px">
              还没有模板？<span style="color: #6386ff; cursor: pointer">点此上传</span>
            </div>
          </template>
        </el-upload>
        <div style="text-align: center">
          <el-button @click="uploadFileVisible = false">取消</el-button>
          <el-button @click="saveCurUpload" type="primary">保存</el-button>
        </div>
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
import { ElMessage, ElMessageBox } from "element-plus"
import { genFileId } from "element-plus"
import { getUserFileListApi, addUserFileApi, delUserFileApi, editUserFileApi, getUploadToken } from "@/api/userFile"
import { getItemListApi } from "@/api/itemList"
import { convertToTree } from "@/utils/formatTree"
onMounted(async () => {
  await getUserFileList()
  let res = (await getItemListApi()).data

  itemTableData.value = convertToTree(res)
})

const tableData = ref([])
const getUserFileList = async () => {
  let arr = cascaderVal.value.map((ele) => {
    if (ele.length > 1) {
      return ele[1]
    } else {
      return ele
    }
  })
  const projectids = arr.join()
  const res = await getUserFileListApi(searchParams.value.name, searchParams.value.mobile, projectids)
  tableData.value = res.data.list.map((ele, i) => {
    return {
      ...ele,
      projectName: ele.project.projectName,
      projectId: ele.project.projectId,
      male: ele.male ? "男" : "女",
      order: i + 1
    }
  })
}

const searchParams = ref({
  name: "",
  mobile: ""
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

let form = reactive({
  name: "",
  age: "",
  job: "",
  male: "",
  projectId: [],
  idCardNo: "",
  bankCardNo: "",
  mobile: "",
  reportUrl: "12311",
  payrollFileUrl: "123123213"
})

const dialogType = ref("add")
const dialogTitlte = "新增/修改/查看成员信息"

const formEl = ref<FormInstance>()

const onSubmit = async () => {
  if (!formEl.value) return
  await formEl.value.validate(async (valid, fields) => {
    if (valid) {
      console.log("submit!")
      let fileArr = fileList.value.map((ele) => {
        return {
          name: ele.name,
          url: `${uploadData.value.previewUrl}/${ele.uid}${ele.name}`
        }
      })

      form.reportUrl = JSON.stringify(fileArr)

      let msg = "新增成功"
      let obj = {
        ...form,
        age: form.age - 0,
        male: form.male == "男" ? true : false,
        bankCardNo: form.bankCardNo - 0
      }

      if (dialogType.value == "add") {
        msg = "新增成功"
        // 多个关联项目多次保存
        for (const prop of form.projectId) {
          obj.projectId = prop
          await addUserFileApi(obj)
        }
      }
      if (dialogType.value == "edit") {
        msg = "修改成功"
        // 多个关联项目多次保存
        for (const prop of form.projectId) {
          obj.projectId = prop
          await editUserFileApi(obj)
        }
      }

      ElMessage({
        message: msg,
        type: "success"
      })
      uploadVisible.value = false
      await getUserFileList()
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

const uploadText = ref("批量上传")

const addNew = () => {
  dialogType.value = "add"
  uploadVisible.value = true
}

const uploadManyFiles = () => {
  uploadText.value = "批量上传"
  uploadFileVisible.value = true
}

const uploadReport = async () => {
  const res = await getUploadToken()
  uploadData.value.previewUrl = res.data.domain
  uploadData.value.token = res.data.token

  uploadText.value = "上传报告"
  uploadFileVisible.value = true
}
const showInfo = (row) => {
  console.log(row)
  form = {
    ...row,
    male: row.male ? "男" : "女"
  }
  dialogType.value = "info"
  uploadVisible.value = true
}

// 关联项目
let cascaderVal = ref([])
const props = {
  multiple: true,
  value: "id",
  label: "projectName"
}
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
  form.projectId = arr

  itemDialogVisible.value = false
}

// 上传
const uploadData = ref({
  key: "",
  token: "",
  previewUrl: ""
})
let fileList = ref([])
let imageSrc = ref("")
const handleUploadSuccess = (res) => {
  if (res.key) {
    imageSrc.value = "http://rx9yjhg17.bkt.clouddn.com/" + res.key // https://xxxx.com 为回显图片的地址，在七牛上配置的映射地址
  } else {
    // this.$message({
    //   type: "error",
    //   message: res.msg
    // })
  }
}

const beforeUpload = (file) => {
  try {
    uploadData.value.key = file.uid + file.name
  } catch (error) {
    console.log(error)
    // this.$message.error("上传失败")
  }
}

let curReport = ref()
const saveCurUpload = () => {
  form.reportUrl = `${uploadData.value.previewUrl}/${fileList.value[0].response.key}`
  curReport.value = fileList.value[0].name
  uploadFileVisible.value = false
}

// 关闭弹窗
const handleCloseUpload = () => {
  uploadFileVisible.value = false
  fileList.value = []
}

const delReportFile = () => {
  fileList.value = []
}

// 删除
const delUserFile = async (id) => {
  ElMessageBox.confirm("是否确定删除", "确认框", {
    confirmButtonText: "确定",
    cancelButtonText: "取消"
  })
    .then(async () => {
      await delUserFileApi(id)
      ElMessage({
        message: "删除成功",
        type: "success"
      })

      await getUserFileList()
    })
    .catch(() => {})
}

// 修改
const edit = (row) => {
  form = row
  dialogType.value = "edit"
  uploadVisible.value = true
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
