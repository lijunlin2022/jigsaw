import AV from 'leancloud-storage'
import jws from '../utils/jws'
import { AV_CONFIG } from '../config/vars'

AV.init({
  appId: AV_CONFIG.appId,
  appKey: AV_CONFIG.appKey,
  masterKey: AV_CONFIG.masterKey,
  serverURL: AV_CONFIG.serverURL
})

/**
 * 注册
 * @param {email, password} body
 * @returns 
 */
async function signUpUser(body) {
  let { email, password } = body
  const user = new AV.User()
  user.setUsername(email)
  user.setPassword(password)
  user.setEmail(email)

  return user.signUp().then(async (user) => {
    const userObjectId = user.getObjectId()
    const userSign = { userId: userObjectId }
    const token = await jws.sign(userSign, new Date().getTime() / 1000)

    let returnUser = {
      userId: userObjectId,
      email,
      token
    }

    return returnUser
  }, (error) => {
    return {
      code: error.code, msg: error.rawMessage
    }
  })
}

export {
  signUpUser
}
