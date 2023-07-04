import { request } from "@/utils/service"

// 用户列表
export function getUserFileListApi(name, mobile, projectids) {
  return request({
    url: `/worker/list?name=${name}&mobile=${mobile}&projectIds=${projectids}`,
    method: "get"
  })
}
// 新增用户列表
export function addUserFileApi(data) {
  return request({
    url: `/worker/add`,
    method: "post",
    data
  })
}
// 修改用户列表
export function editUserFileApi(data) {
  return request({
    url: `/worker/edit`,
    method: "post",
    data
  })
}
// 删除用户列表
export function delUserFileApi(id) {
  return request({
    url: `/worker/delete/${id}`,
    method: "get",
  })
}
