import { request } from "@/utils/service"

// 角色列表
export function getRoleListApi() {
  return request({
    url: "/role/list",
    method: "get"
  })
}

// 新增角色
export function addRoleApi(data) {
  return request({
    url: "/role/add",
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
