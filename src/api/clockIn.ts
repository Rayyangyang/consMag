import { request } from "@/utils/service"

// 用户列表
export function getCheckInListApi() {
  return request({
    url: `/checkIn/list`,
    method: "get"
  })
}
