import AV from 'leancloud-storage'
import jws from '../utils/jws'
import { AV_CONFIG } from '../config/vars'

AV.init({
  appId: AV_CONFIG.appId,
  appKey: AV_CONFIG.appKey,
  masterKey: AV_CONFIG.masterKey,
  serverURL: AV_CONFIG.serverURL
})

AV.Cloud.useMasterKey();

const userMember = {
  v0: 'xjksda',
  v1: 'sadskx'
}

/**
 * 注册会员
 * @param {user, email} params
 * @returns 
 */
async function signUpMembership (params) {
  const { user, email } = params
  const userId = user.getObjectId()

  const membership = AV.Object.extend('Membership')
  const membershipObj = new membership()
  membershipObj.set('email', email)
  membershipObj.set('userObjectId', userId)
  membershipObj.set('userObject', user)
  membershipObj.set('member', userMember.v0)
  
  return membershipObj.save().then(async () => {
    const userSign = { userId }
    const token = await jws.sign(userSign, new Date().getTime() / 1000)
    const data = {
      userId,
      email,
      token
    }
    return {
      code: 0,
      data,
      msg: '成功'
    }
  })
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

  return user.signUp().then(
    async (user) => {
      return await signUpMembership({ user, email })
    },
    (error) => {
      return {
        code: error.code,
        msg: error.rawMessage
      }
    }
  )
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

/**
 * 查询会员信息 
 */
async function getMembership(userId) {
  const membership = new AV.Query('Membership')
  membership.equalTo('userObjectId', userId)
  return membership.first().then(function (account) {
    let res = {}
    if (account) {
      res = {
        userId: account.get('userObjectId'),
        expirationAt: new Date(account.get('expirationAt')).getTime(),
        member: account.get('member'),
        level: account.get('level')
      }
    }
    return { data: res }
  })
}

async function syncUserInfo(headers) {
  const token = headers['x-ut']
  const userId = headers['x-ui']

  // 没有 token
  if (!token) {
    return {
      code: -1,
      msg: '未登录'
    }
  }

  const res = await jws.verify(token)
  const payload = res.payload
  const date = new Date().getTime()
  const expireTime = payload.expirationAt

  if (!expireTime) {
    return {
      code: -1,
      msg: '未登录'
    }
  }

  // 有 token，但是 token 过期了
  if (expireTime < date) {
    return {
      code: -1,
      msg: '登录过期了，请重新登录'
    }
  }

  // 有 token，且 token 没过期，返回会员过期时间
  const { data } = await getMembership(userId)
  return {
    code: 0,
    data
  }
}

export {
  signUpUser,
  signInUser,
  forgetPassword,
  syncUserInfo
}
