import { syncUserInfo } from '../../service/av'

export default defineEventHandler(async (event) => {
  const headers = getHeaders(event)
  return syncUserInfo(headers)
})
