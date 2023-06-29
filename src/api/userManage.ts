import { request } from "@/utils/service"

// 用户列表
export function getUserManageListApi() {
  return request({
    url: "/management/list",
    method: "get"
  })
}

// 新增用户
export function addUserApi(data) {
  return request({
    url: "/management/add",
    method: "post",
    data
  })
}

// 编辑角色
export function editRoleApi(data) {
  return request({
    url: "/role/edit",
    method: "post",
    data
  })
}

// 删除角色
export function delRoleApi(data) {
  return request({
    url: "/role/delete",
    method: "post",
    data
  })
}
