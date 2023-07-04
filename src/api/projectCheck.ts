import { request } from "@/utils/service"

// 用户列表
export function getProjectListApi(ids = "") {
  return request({
    url: `/inspect/list?projectIds=${ids}`,
    method: "get"
  })
}

// 新增一级项目名称
export function addFirItemApi(data) {
  return request({
    url: "/project/add",
    method: "post",
    data
  })
}

// 新增项目名称
export function editFirItemApi(data) {
  return request({
    url: "/project/edit",
    method: "post",
    data
  })
}

// 删除项目
export function delFirItemApi(data) {
  return request({
    url: "/project/delete",
    method: "post",
    data
  })
}
