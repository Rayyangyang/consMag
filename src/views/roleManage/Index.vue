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
            <el-checkbox v-model="isCheckAllWeb" label="全选" size="large" />
          </el-tab-pane>
          <el-tab-pane label="小程序端" name="second">
            <el-checkbox v-model="isCheckAllMini" label="全选" size="large" />
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

// web端
const isCheckAllWeb = ref(false)

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
