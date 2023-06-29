<template>
  <div class="my-container" style="position: relative">
    <div class="top-serach">
      <div>
        <el-input v-model="searchParams.name" placeholder="请输入成员姓名" />
        <el-input v-model="searchParams.phone" placeholder="请输入成员手机号" />
        <el-button style="background-color: #6386ff; color: #fff; border-radius: 10px; padding: 10px 20px"
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
          <template #default>
            <span style="cursor: pointer; margin-right: 10px; color: #000" @click="showInfo">详情</span>
            <span style="cursor: pointer; margin-right: 10px; color: #000" @click="dialogVisible = true">修改</span>
            <span style="cursor: pointer; margin-right: 10px; color: #ff0000">删除</span>
            <span style="cursor: pointer; margin-right: 10px; color: #000">重置密码</span>
          </template>
        </el-table-column>
      </el-table>
      <div style="position: absolute; right: 20px; bottom: 20px">
        <el-pagination background layout="prev, pager, next" :total="total" />
      </div>
    </div>

    <el-dialog v-model="dialogVisible" :title="dialogTitlte" width="40%" :before-close="handleClose">
      <div class="diag-content-wrapper">
        <el-form :model="form" label-width="120px" :rules="rules" ref="formEl">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="form.mobile" maxlength="11" />
            <p style="color: #b1b1b1; margin: 0">密码默认：123456</p>
          </el-form-item>
          <el-form-item label="管理员" prop="isAdmin">
            <el-checkbox v-model="form.isAdmin" size="large" />
          </el-form-item>
          <el-form-item label="关联项目" prop="projectIds">
            <el-button type="primary" @click="itemDialogVisible = true">关联项目</el-button>
          </el-form-item>
          <el-form-item label="角色" prop="roleId">
            <el-select v-model="form.roleId" placeholder="请选择角色">
              <el-option v-for="item in roleList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
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

    <el-dialog v-model="itemDialogVisible" title="Tips" width="40%" :before-close="handleClose">
      <div>
        <el-table :data="itemTableData" style="width: 100%; margin-bottom: 20px" row-key="id" border default-expand-all>
          <el-table-column type="selection" width="55" />
          <el-table-column prop="order" label="序号" />
          <el-table-column prop="name" label="项目名称" />
        </el-table>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="itemDialogVisible = false">返回上一步</el-button>
          <el-button type="primary" @click="dialogVisible = false"> 保存 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue"
import type { FormInstance, FormRules } from "element-plus"
import { getUserManageListApi, addUserApi } from "@/api/userManage"
import { getRoleListApi } from "@/api/roles"
import { getItemListApi } from "@/api/itemList"
const searchParams = ref({
  name: "",
  phone: ""
})

const form = reactive({
  name: "",
  mobile: "",
  contactItem: [],
  roleId: "",
  isAdmin: false,
  projectIds: []
})

const curDiaType = ref("add")

const roleList = ref([])
const itemList = ref([])
onMounted(async () => {
  await getUserManageList()
  roleList.value = (await getRoleListApi()).data.map((ele) => {
    return {
      value: ele.roleId,
      label: ele.roleName
    }
  })

  itemList.value = (await getItemListApi()).map((ele, i) => {
    return {
      ...ele,
      order: i + 1
    }
  })
})

const total = ref(0)

const getUserManageList = async () => {
  const res = await getUserManageListApi()
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
      return
      const subObj = {}

      if (curDiaType.value == "add") {
        await addUserApi(subObj)
      }

      console.log("submit!")
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
const showInfo = () => {
  dialogType.value = "info"
  dialogVisible.value = true
}

// 关联项目
const itemDialogVisible = ref(false)

const itemTableData = [
  {
    id: 1,
    date: "2016-05-02",
    name: "wangxiaohu",
    address: "No. 189, Grove St, Los Angeles"
  },
  {
    id: 2,
    date: "2016-05-04",
    name: "wangxiaohu",
    address: "No. 189, Grove St, Los Angeles"
  },
  {
    id: 3,
    date: "2016-05-01",
    name: "wangxiaohu",
    address: "No. 189, Grove St, Los Angeles",
    children: [
      {
        id: 31,
        date: "2016-05-01",
        name: "wangxiaohu",
        address: "No. 189, Grove St, Los Angeles"
      },
      {
        id: 32,
        date: "2016-05-01",
        name: "wangxiaohu",
        address: "No. 189, Grove St, Los Angeles"
      }
    ]
  },
  {
    id: 4,
    date: "2016-05-03",
    name: "wangxiaohu",
    address: "No. 189, Grove St, Los Angeles"
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

.diag-content-wrapper {
  padding: 20px;
}
</style>
