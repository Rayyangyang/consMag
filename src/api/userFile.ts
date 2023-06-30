import { request } from "@/utils/service"

// 用户列表
export function getUserFileListApi() {
  return request({
    url: `/worker/list`,
    method: "get"
  })
}
