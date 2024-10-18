import AV from 'leancloud-storage'
import jws from '../utils/jws'
import { AV_CONFIG } from '../config/vars'

AV.init({
  appId: AV_CONFIG.appId,
  appKey: AV_CONFIG.appKey,
  masterKey: AV_CONFIG.masterKey,
  serverURL: AV_CONFIG.serverURL
})

const vipLevel = {
  v0: 'v0',
  v1: 'v1'
}

/**
 * 注册
 * @param {email, password} body
 * @returns 
 */
async function signUpUser(body) {
  const { email, password } = body
  const user = new AV.User()
  user.setUsername(email)
  user.setPassword(password)
  user.setEmail(email)

  return user.signUp().then(async (user) => {
    const userId = user.getObjectId()

    const vip = new AV.Object.extend('vip')
    vip.set('email', email)
    vip.set('userObjectId', userId)
    vip.set('userObject', user)
    vip.set('level', vipLevel.v0)

    return vip.save().then(async () => {
      const userSign = { userId }
      const token = await jws.sign(userSign, new Date().getTime() / 1000)
      return {
        userId,
        email,
        token
      }
    }), (error) => {
      return {
        code: error.code, msg: error.rawMessage
      }
    }
  })
}

/**
 * 登录
 * @param {email. password} body 
 * @returns 
 */
async function signInUser(body) {
  const { email, password } = body
  try {
    const user = await AV.User.loginWithEmail(email, password)
    const userId = user.getObjectId()

    const userSign = { userId }
    const token = await jws.sign(userSign, new Date().getTime() / 1000)
    return {
      userId,
      email,
      token
    }
  } catch (error) {
    return {
      code: error.code,
      msg: error.rawMessage
    }
  }
}

/**
 * 重置密码
 * @param {email} body 
 * @returns 
 */
async function forgetPassword(body) {
  const { email } = body
  try {
    await AV.User.requestPasswordReset(email)
    return {
      code: 0,
      msg: '重置密码邮件发送成功'
    }
  } catch (error) {
    return {
      code: error.code,
      msg: error.rawMessage
    }
  }
}

export {
  signUpUser,
  signInUser,
  forgetPassword
}
