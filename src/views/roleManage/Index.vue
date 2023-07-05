<template>
  <div class="my-container">
    <div class="left-tree">
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px 20px 0">
        <span style="font-weight: bold"> 角色 </span>
        <span style="color: #6386ff; cursor: pointer" @click="addNew">+ 新增角色</span>
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
            {{ ele.roleName }}
          </span>
          <div v-show="curI == i">
            <el-icon
              style="color: #6386ff; font-weight: bold; font-size: 16px; margin-right: 10px; cursor: pointer"
              @click="editRole(ele)"
            >
              <Edit />
            </el-icon>
            <el-icon
              style="color: #6386ff; font-weight: bold; font-size: 16px; cursor: pointer"
              @click="delRole(ele.roleId)"
              ><Delete
            /></el-icon>
          </div>
        </div>
      </div>
    </div>
    <div class="right-content">
      <el-checkbox v-model="checked1" label="管理角色权限" size="large" />
      <div>
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane label="web端" name="first">
            <el-checkbox v-model="isCheckAllWeb" label="全选" size="large" @change="checkAllWebRole" />
            <div v-for="(ele, i) in webRoleList">
              <el-checkbox
                v-model="ele.checkAll"
                :indeterminate="ele.isIndeterminate"
                @change="(e) => handleCheckAllChange(e, ele, i)"
                >{{ ele.title }}</el-checkbox
              >
              <el-checkbox-group
                v-model="ele.checkChildList"
                @change="(e) => handleCheckedList(e, ele)"
                style="margin-left: 20px; margin-bottom: 20px"
              >
                <el-checkbox v-for="list in ele.list" :key="list" :label="list" />
              </el-checkbox-group>
            </div>
          </el-tab-pane>
          <el-tab-pane label="小程序端" name="second">
            <el-checkbox v-model="isCheckAllMini" label="全选" size="large" @change="checkAllWxRole" />
            <div v-for="(ele, i) in wxRoleList">
              <el-checkbox
                v-model="ele.checkAll"
                :indeterminate="ele.isIndeterminate"
                @change="(e) => handleCheckAllChange(e, ele, i)"
                >{{ ele.title }}</el-checkbox
              >
              <el-checkbox-group
                v-model="ele.checkChildList"
                @change="(e) => handleCheckedList(e, ele)"
                style="margin-left: 20px; margin-bottom: 20px"
              >
                <el-checkbox v-for="list in ele.list" :key="list" :label="list" />
              </el-checkbox-group>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <el-dialog v-model="dialogVisible" title="新增/修改角色" width="500px" :before-close="handleClose">
      <div>
        <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="rules"
          label-width="120px"
          class="demo-ruleForm"
          :size="formSize"
          status-icon
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="ruleForm.roleName" />
          </el-form-item>
          <el-form-item>
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submitForm(ruleFormRef)"> 保存 </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue"
import { getRoleListApi, addRoleApi, editRoleApi, delRoleApi } from "@/api/roles"
import { ElMessage } from "element-plus"
onMounted(async () => {
  await getRoleList()
})

const activeName = ref("first")
const handleClick = () => {}
const handleClose = () => {}

// web端
const isCheckAllWeb = ref(false)
const checked1 = ref(false)

// role list
const webRoleList = ref([
  {
    title: "角色管理",
    checkAll: false,
    isIndeterminate: false,
    checkChildList: [],
    list: ["新增角色", "删除角色", "编辑角色", "查看角色"]
  },
  {
    title: "人员管理",
    checkAll: false,
    isIndeterminate: false,
    checkChildList: [],
    list: ["新增人员", "删除人员", "编辑人员", "查看人员", "重置密码"]
  },
  {
    title: "项目目录",
    checkAll: false,
    isIndeterminate: false,
    checkChildList: [],
    list: ["新增目录", "删除目录", "编辑目录", "查看详情"]
  },
  {
    title: "农民工工资",
    checkAll: false,
    isIndeterminate: false,
    checkChildList: [],
    list: ["上传工资", "删除工资", "编辑工资", "查看详情"]
  },
  {
    title: "人员档案",
    checkAll: false,
    isIndeterminate: false,
    checkChildList: [],
    list: ["上传档案", "删除档案", "编辑档案", "查看详情", "导入档案", "上传体检"]
  },
  {
    title: "项目检查",
    checkAll: false,
    isIndeterminate: false,
    checkChildList: [],
    list: ["编辑检查", "查看详情"]
  },
  {
    title: "打卡",
    checkAll: false,
    isIndeterminate: false,
    checkChildList: [],
    list: ["编辑打卡", "查看详情"]
  }
])

const wxRoleList = ref([
  {
    title: "项目目录",
    checkAll: false,
    isIndeterminate: false,
    checkChildList: [],
    list: ["查看目录"]
  },
  {
    title: "农民工工资",
    checkAll: false,
    isIndeterminate: false,
    checkChildList: [],
    list: ["上传工资", "删除工资", "修改工资", "查看工资"]
  },
  {
    title: "人员档案",
    checkAll: false,
    isIndeterminate: false,
    checkChildList: [],
    list: ["查看详情"]
  },
  {
    title: "项目检查",
    checkAll: false,
    isIndeterminate: false,
    checkChildList: [],
    list: ["上传项目", "审核检查", "编辑检查", "查看详情"]
  },
  {
    title: "打卡",
    checkAll: false,
    isIndeterminate: false,
    checkChildList: [],
    list: ["上传打卡", "编辑打卡", "查看详情"]
  }
])

const checkAllWebRole = (val) => {
  for (const prop of webRoleList.value) {
    prop.checkAll = val
    prop.checkChildList = val ? prop.list : []
  }
}

const checkAllWxRole = (val) => {
  for (const prop of wxRoleList.value) {
    prop.checkAll = val
    prop.checkChildList = val ? prop.list : []
  }
}

const handleCheckAllChange = (e, ele, i) => {
  console.log(123000, ele)
  ele.checkChildList = e ? ele.list : []
  ele.isIndeterminate = false
}
const handleCheckedList = (e, ele) => {
  console.log(123)
  const checkedCount = e.length
  ele.checkAll = checkedCount === ele.list.length
  ele.isIndeterminate = checkedCount > 0 && checkedCount < ele.list.length
}

// 小程序端
const isCheckAllMini = ref(false)

const isEdit = ref(false)

const curEditRole = ref({})
const dialogVisible = ref(false)

const ruleForm = ref({
  roleName: ""
})
const ruleFormRef = ref()

const rules = reactive({
  roleName: [{ required: true, message: "角色名为必填", trigger: "blur" }]
})

const delRole = async (id) => {
  await delRoleApi({
    roleId: id
  })

  ElMessage({
    message: "删除成功",
    type: "success"
  })
  await getRoleList()
}

const addNew = () => {
  dialogVisible.value = true
  isEdit.value = false
}
const editRole = (row) => {
  curEditRole.value = row
  dialogVisible.value = true
  ruleForm.value.roleName = curEditRole.value.roleName
  isEdit.value = true
}

const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      console.log("submit!")

      if (isEdit.value) {
        await editRoleApi({
          roleName: ruleForm.value.roleName,
          roleId: curEditRole.value.roleId,
          authorities: [curEditRole.value.authorities - 0]
        })
      } else {
        await addRoleApi({
          roleName: ruleForm.value.roleName
        })
      }

      dialogVisible.value = false
      ElMessage({
        message: isEdit.value ? "修改成功" : "新增成功",
        type: "success"
      })
      await getRoleList()
    } else {
      console.log("error submit!", fields)
    }
  })
}

const getRoleList = async () => {
  const res = await getRoleListApi()
  roleList.value = res.data
}

const roleList = ref([])

const curI = ref(0)
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
