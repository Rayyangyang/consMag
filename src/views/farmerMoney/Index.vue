<template>
  <div class="my-container">
    <div class="top-serach">
      <div>
        <el-cascader :options="itemTableData" :props="props" v-model="cascaderVal" />

        <el-button
          style="background-color: #6386ff; color: #fff; border-radius: 10px; padding: 10px 20px; margin-left: 20px"
          @click="search"
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
        <el-table-column prop="fileName" label="文件名" />
        <el-table-column prop="projectName" label="项目名称" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column label="操作" width="240">
          <template #default="scope">
            <span style="cursor: pointer; margin-right: 10px; color: #000" @click="showInfo(scope.row)"> 详情 </span>
            <span style="cursor: pointer; margin-right: 10px; color: #000" @click="edit(scope.row)">修改 </span>
            <span style="cursor: pointer; margin-right: 10px; color: #ff0000" @click="del(scope.row.id)">删除</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="dialogVisible" :title="dialogTitlte" width="30%" :before-close="handleClose">
      <div class="diag-content-wrapper">
        <el-form :model="form" label-width="120px" :rules="rules" ref="formEl">
          <el-form-item label="文件名" prop="fileName">
            <el-input v-model="form.fileName" :disabled="dialogType == 'info'" />
          </el-form-item>
          <el-form-item label="关联项目" prop="projectIds">
            <el-button type="primary" @click="itemDialogVisible = true">关联项目</el-button>
          </el-form-item>
          <el-form-item label="上传文件" prop="fileUrl">
            <el-button type="primary">上传文件</el-button>
          </el-form-item>
          <el-form-item>
            <div style="text-align: center; width: 80%">
              <el-button>取 消</el-button>
              <el-button type="primary" v-if="dialogType == 'info'">确定</el-button>
              <el-button type="primary" @click="onSubmit" v-else>保 存</el-button>
            </div>
          </el-form-item>
        </el-form>
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
import { ElMessage, ElMessageBox, dayjs, type FormInstance, type FormRules } from "element-plus"
import { getItemListApi } from "@/api/itemList"
import { convertToTree } from "@/utils/formatTree"
import { getFarmerMoneyListApi, addUserApi, delUserApi, editUserApi } from "@/api/farmerMoney"

const props = {
  // props.
  multiple: true,
  value: "id",
  label: "projectName"
}
const serachParams = ref({
  page: 1,
  projectId: ""
})

const search= async()=>{
  console.log(cascaderVal.value)

  let arrStr = cascaderVal.value.map(ele => ele.join()).join()
  console.log(arrStr)
  serachParams.value.projectId = arrStr
  await getFarmerMoneyList()

}

let cascaderVal = ref()

onMounted(async () => {
  let res = (await getItemListApi()).data
  itemTableData.value = convertToTree(res)
  await getFarmerMoneyList()
})

const tableData = ref([])
const getFarmerMoneyList = async () => {
  let res = await getFarmerMoneyListApi(serachParams.value.projectId, serachParams.value.page)
  tableData.value = res.data?.list?.map((ele, i) => {
    return {
      ...ele,
      projectName: ele.projects.length > 1 ? `${ele.projects[0].projectName}...` : ele.projects[0].projectName,
      createTime: dayjs(ele.createdAt).format("YYYY-MM-DD HH:mm"),
      order: i + 1
    }
  })
}

let form = reactive({
  fileName: "",
  projectIds: [],
  fileUrl: "test-123"
})

const dialogType = ref("add")
const dialogTitlte = "新增/修改/查看成员信息"

const formEl = ref<FormInstance>()

const onSubmit = async () => {
  if (!formEl.value) return
  await formEl.value.validate(async (valid, fields) => {
    if (valid) {
      console.log(form)
      let msg = "新增成功"

      if (dialogType.value == "add") {
        msg = "新增成功"
        await addUserApi(form)
      }
      if (dialogType.value == "edit") {
        msg = "修改成功"
        console.log(form)
        let subObj = {
          fileName: form.fileName,
          projectIds: form.projectIds,
          fileUrl: form.fileUrl,
          salaryId: form.id
        }

        await editUserApi(subObj)
      }

      ElMessage({
        message: msg,
        type: "success"
      })
      await getFarmerMoneyList()
      dialogVisible.value = false
      console.log("submit!")
    } else {
      console.log("error submit!", fields)
    }
  })
}
const rules = reactive<FormRules>({
  fileName: [{ required: true, message: "请输入文件名", trigger: "change" }],
  projectIds: [{ required: true, message: "请选择关联项目", trigger: "change" }]
  // fileUrl: [{ required: false, message: "请上传文件", trigger: "change" }]
})

const dialogVisible = ref(false)

const handleClose = () => {
  dialogVisible.value = false
}

const addNew = () => {
  dialogType.value = "add"
  dialogVisible.value = true
}
const showInfo = (row) => {
  form = row
  dialogType.value = "info"
  dialogVisible.value = true
}

// 关联项目
const itemTableData = ref([])
let itemDialogVisible = ref(false)
let multipleSelection = ref([])
const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val
}

// 保存关联项目
const saveItemList = () => {
  console.log(12300, multipleSelection.value)
  let arr = multipleSelection.value.map((ele) => ele.id)
  form.projectIds = arr

  itemDialogVisible.value = false
}

// 删除
const del = async (id) => {
  ElMessageBox.confirm("是否确定删除", "确认框", {
    confirmButtonText: "确定",
    cancelButtonText: "取消"
  })
    .then(async () => {
      await delUserApi(id)
      ElMessage({
        message: "删除成功",
        type: "success"
      })

      await getFarmerMoneyList()
    })
    .catch(() => {})
}

// 修改

const edit = (row) => {
  console.log(12300, row)
  form = row
  dialogType.value = "edit"
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
