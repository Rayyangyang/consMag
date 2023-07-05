<template>
  <div class="my-container" style="position: relative">
    <div class="top-serach">
      <div>
        <el-input v-model="searchParams.name" placeholder="请输入成员姓名" />
        <el-input v-model="searchParams.mobile" placeholder="请输入成员手机号" />
        <el-button
          style="background-color: #6386ff; color: #fff; border-radius: 10px; padding: 10px 20px"
          @click="handleSearch"
          >查询</el-button
        >
      </div>
      <el-button style="background-color: #6386ff; color: #fff; border-radius: 10px; padding: 10px 20px" @click="addNew"
        >新增</el-button
      >
    </div>

    <div class="table-content">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="order" label="序号" width="150" />
        <el-table-column prop="name" label="成员姓名" />
        <el-table-column prop="mobile" label="手机号" />
        <el-table-column prop="roleName" label="角色" />
        <el-table-column label="操作" width="240">
          <template #default="scope">
            <span style="cursor: pointer; margin-right: 10px; color: #000" @click="showInfo(scope.row)">详情</span>
            <span style="cursor: pointer; margin-right: 10px; color: #000" @click="edit(scope.row)">修改</span>
            <span style="cursor: pointer; margin-right: 10px; color: #ff0000" @click="delRole(scope.row)">删除</span>
            <span style="cursor: pointer; margin-right: 10px; color: #000" @click="resetPwd(scope.row)">重置密码</span>
          </template>
        </el-table-column>
      </el-table>
      <div style="position: absolute; right: 20px; bottom: 20px">
        <el-pagination background layout="prev, pager, next" :total="total" @current-change="changePage" />
      </div>
    </div>

    <el-dialog v-model="dialogVisible" :title="dialogTitlte" width="40%" :before-close="handleClose">
      <div class="diag-content-wrapper">
        <el-form :model="form" label-width="120px" :rules="rules" ref="formEl">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" :disabled="dialogType == 'info'" />
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="form.mobile" maxlength="11" :disabled="dialogType == 'info'" />
            <p style="color: #b1b1b1; margin: 0">密码默认：123456</p>
          </el-form-item>
          <el-form-item label="管理员" prop="isAdmin">
            <el-checkbox v-model="form.isAdmin" size="large" :disabled="dialogType == 'info'" />
          </el-form-item>
          <el-form-item label="关联项目" prop="projectIds">
            <el-button type="primary" @click="itemDialogVisible = true">关联项目</el-button>
          </el-form-item>
          <el-form-item label="角色" prop="roleId">
            <el-select v-model="form.roleId" placeholder="请选择角色" :disabled="dialogType == 'info'">
              <el-option v-for="item in roleList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <div style="text-align: center; width: 100%">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="dialogVisible = false" v-if="dialogType == 'info'">确定</el-button>
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
import { ElMessage, type FormInstance, type FormRules } from "element-plus"
import { getUserManageListApi, addUserApi, resetPwdApi, delUserApi, editUserApi } from "@/api/userManage"
import { getRoleListApi } from "@/api/roles"
import { getItemListApi } from "@/api/itemList"
import { convertToTree } from "@/utils/formatTree"
const searchParams = ref({
  name: "",
  mobile: "",
  page: 1
})

let form = reactive({
  name: "",
  mobile: "",
  roleId: "",
  isAdmin: false,
  projectIds: []
})

const curDiaType = ref("add")

const handleSearch = async() => {
  await getUserManageList()
}

const changePage = (num) => {
  searchParams.value.page = num
}
// 项目列表

const roleList = ref([])
const itemTableData = ref([])

onMounted(async () => {
  await getUserManageList()
  roleList.value = (await getRoleListApi()).data.map((ele) => {
    return {
      value: ele.roleId,
      label: ele.roleName
    }
  })

  let res = (await getItemListApi()).data
  console.log(123, res)
  itemTableData.value = convertToTree(res)
})

const total = ref(0)

const getUserManageList = async () => {
  const res = await getUserManageListApi(searchParams.value.name, searchParams.value.mobile, searchParams.value.page)
  total.value = res.data.totalCount
  tableData.value = res.data.list.map((ele, i) => {
    return {
      ...ele,
      order: i + 1
    }
  })

  console.log(1000, res)
}

const dialogType = ref("add")
const dialogTitlte = "新增/修改/查看成员信息"

const formEl = ref<FormInstance>()

const onSubmit = async () => {
  if (!formEl.value) return
  await formEl.value.validate(async (valid, fields) => {
    if (valid) {
      console.log(form)
      let msg = "保存成功"
      if (curDiaType.value == "add") {
        msg = "保存成功"
        await addUserApi(form)
      }
      if (curDiaType.value == "edit") {
        console.log(form)
        msg = "修改成功"
        await editUserApi(form)
      }

      dialogVisible.value = false
      ElMessage({
        message: msg,
        type: "success"
      })
      console.log("submit!")
      await getUserManageList()
    } else {
      console.log("error submit!", fields)
    }
  })
}
const rules = reactive<FormRules>({
  name: [{ required: true, message: "请输入姓名", trigger: "change" }],
  mobile: [
    {
      required: true,
      message: "请输入正确的手机号",
      trigger: "change"
    }
  ],
  roleId: [{ required: true, message: "请选择角色", trigger: "change" }],
  projectIds: [{ required: true, message: "请选择关联项目", trigger: "change" }]
})

const dialogVisible = ref(false)

const handleClose = () => {
  dialogVisible.value = false
}

const tableData = ref([])

const addNew = () => {
  dialogType.value = "add"
  dialogVisible.value = true
}
const showInfo = (row) => {
  console.log(1230, row)
  form = row
  dialogType.value = "info"
  dialogVisible.value = true
}

// 关联项目
const itemDialogVisible = ref(false)
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

// 重置密码
const resetPwd = async (row) => {
  console.log(row)
  await resetPwdApi({
    userId:row.id
  })
  ElMessage({
    message: "重置成功",
    type: "success"
  })
}

// 删除
const delRole = async (row) => {
  await delUserApi(row.id)
  ElMessage({
    message: "删除成功",
    type: "success"
  })
}

// 编辑
const edit = (row) => {
  console.log(row)
  curDiaType.value = "edit"
  form = reactive({
    ...row,
    userId: row.id
  })

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

.diag-content-wrapper {
  padding: 20px;
}
</style>
