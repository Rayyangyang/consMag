import { request } from "@/utils/service"

// 用户列表
export function getFarmerMoneyListApi(projectId, page) {
  return request({
    url: `/salary/list?projectId=${projectId}&page=${page}`,
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
export function editUserApi(data) {
  return request({
    url: "/management/edit",
    method: "post",
    data
  })
}

// 删除角色
export function delUserApi(id) {
  return request({
    url: `/management/delete?id=${id}`,
    method: "get"
  })
}

// 重置密码
export function resetPwdApi(data) {
  return request({
    url: "/management/resetPwd",
    method: "post",
    data
  })
}
