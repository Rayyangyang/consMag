<template>
  <div class="my-container">
    <div class="top-serach">
      <div>
        <el-input v-model="searchVal" placeholder="请输入项目"></el-input>
        <el-button
          style="background-color: #6386ff; color: #fff; border-radius: 10px; padding: 10px 20px"
          @click="searchList"
          >查询</el-button
        >
      </div>
      <el-button style="background-color: #6386ff; color: #fff; border-radius: 10px; padding: 10px 20px" @click="addNew"
        >新增</el-button
      >
    </div>

    <div class="table-content">
      <el-table :data="tableData" style="width: 100%" default-expand-all row-key="order">
        <el-table-column prop="id" label="id" width="150" />
        <el-table-column prop="projectName" label="项目名称" />
        <el-table-column label="操作" width="240">
          <template #default="scope">
            <span
              style="cursor: pointer; margin-right: 10px; color: #000"
              @click="addSecItem(scope.row)"
              v-if="!scope.row.isChild"
              >新增下级</span
            >
            <span style="cursor: pointer; margin-right: 10px; color: #000" @click="edit(scope.row)">修改</span>
            <span style="cursor: pointer; margin-right: 10px; color: #ff0000" @click="delFirItem(scope.row)">删除</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="dialogVisible" :title="dialogTitlte" width="40%" :before-close="handleClose">
      <div class="diag-content-wrapper">
        <el-form :model="form" label-width="120px" :rules="rules" ref="formEl">
          <el-form-item label="一级项目名称" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item>
            <div style="text-align: center; width: 80%">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="onSubmit">保 存</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

    <el-dialog v-model="secDialogVisible" :title="dialogTitlte" width="40%">
      <div class="diag-content-wrapper">
        <el-form :model="curEditForm" label-width="120px" :rules="rules" ref="formElSec">
          <el-form-item label="一级项目名称">
            <p style="margin: 0">{{ curEditForm.projectName }}</p>
          </el-form-item>
          <el-form-item label="二级项目名称" prop="name">
            <el-input v-model="curEditForm.name" />
          </el-form-item>
          <el-form-item>
            <div style="text-align: center; width: 80%">
              <el-button @click="secDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="onSubmitSec">保 存</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue"
import { ElMessage, type FormInstance, type FormRules } from "element-plus"
import { getItemListApi, addFirItemApi, editFirItemApi, delFirItemApi } from "@/api/itemList"
import { convertToTree } from "@/utils/formatTree"
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

const isEdit = ref(false)

onMounted(async () => {
  await getItemList()
})

let searchVal = ref("")

const searchList =async () => {
  await getItemList(searchVal.value)

}

const getItemList = async (projectName = "") => {
  let res = (await getItemListApi(projectName)).data.map((ele, i) => {
    return {
      ...ele,
      order: i + 1
    }
  })
  tableData.value = convertToTree(res)
}

const form = reactive({
  name: "",
  id: ""
})

const dialogType = ref("add")
const dialogTitlte = "新增/修改目录"

const formEl = ref<FormInstance>()

const onSubmit = async () => {
  if (!formEl.value) return
  await formEl.value.validate(async (valid, fields) => {
    if (valid) {
      let msg = "新增成功"
      if (isEdit.value) {
        msg = "修改成功"
        await editFirItemApi({
          projectId: form.id,
          name: form.name
        })
      } else {
        const res = await addFirItemApi({
          name: form.name,
          parentId: 0
        })
        msg = "新增成功"
      }

      ElMessage({
        message: msg,
        type: "success"
      })
      await getItemList()
      dialogVisible.value = false
      console.log("submit!")
    } else {
      console.log("error submit!", fields)
    }
  })
}
const rules = reactive<FormRules>({
  name: [{ required: true, message: "请输入项目名称", trigger: "change" }]
})

const dialogVisible = ref(false)

const handleClose = () => {
  dialogVisible.value = false
}

const tableData = ref([])

const addNew = () => {
  dialogType.value = "add"
  isEdit.value = false
  dialogVisible.value = true
}

let secDialogVisible = ref(false)
const addSecItem = (row) => {
  console.log(12300, row)
  isEdit.value = false
  secDialogVisible.value = true
  curEditForm.value = row
}

const curEditForm = ref({})

let formElSec = ref()
const onSubmitSec = async () => {
  console.log(curEditForm.value)

  if (!formElSec.value) return
  await formElSec.value.validate(async (valid, fields) => {
    if (valid) {
      let msg = "新增成功"
      if (isEdit.value) {
        await editFirItemApi({
          projectId: curEditForm.value.id,
          name: curEditForm.value.name
        })
        msg = "修改成功"
      } else {
        await addFirItemApi({
          name: curEditForm.value.name,
          parentId: curEditForm.value.id
        })

        msg = "新增成功"
      }

      console.log(123099)

      ElMessage({
        message: msg,
        type: "success"
      })
      await getItemList()
      secDialogVisible.value = false
    } else {
      console.log("error submit!", fields)
    }
  })
}

const edit = (row) => {
  // curEditForm.value = rowc
  console.log(12300, row)
  isEdit.value = true
  console.log(row)
  if (!row.isChild) {
    form.name = row.projectName
    form.id = row.id
    dialogVisible.value = true
  } else {
    curEditForm.value = {
      projectName: row.parentName,
      name: row.projectName,
      id: row.id
    }
    secDialogVisible.value = true
  }
}

const delFirItem = async (row) => {
  await delFirItemApi({
    projectId: row.id
  })
  ElMessage({
    message: "删除成功",
    type: "success"
  })
  await getItemList()
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
