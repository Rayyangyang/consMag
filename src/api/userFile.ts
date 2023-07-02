import { request } from "@/utils/service"

// 用户列表
export function getUserFileListApi() {
  return request({
    url: `/worker/list`,
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
