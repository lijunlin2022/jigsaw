import { forgetPassword } from '../../service/av'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  return forgetPassword(body)
})
