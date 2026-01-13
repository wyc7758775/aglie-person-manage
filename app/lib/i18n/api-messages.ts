export const apiMessages = {
  'zh-CN': {
    loginSuccess: '登录成功',
    loginFailed: '登录失败',
    registerSuccess: '注册成功',
    registerFailed: '注册失败',
    nicknameRequired: '请填写昵称',
    passwordRequired: '请填写密码',
    passwordTooShort: '密码长度至少6位',
    passwordMismatch: '两次输入的密码不一致',
    userNotFound: '用户不存在',
    wrongPassword: '密码错误',
    userAlreadyExists: '用户已存在',
    networkError: '网络错误，请稍后重试',
    serverError: '服务器内部错误',
  },
  'en-US': {
    loginSuccess: 'Login successful',
    loginFailed: 'Login failed',
    registerSuccess: 'Registration successful',
    registerFailed: 'Registration failed',
    nicknameRequired: 'Please enter your nickname',
    passwordRequired: 'Please enter your password',
    passwordTooShort: 'Password must be at least 6 characters',
    passwordMismatch: 'Passwords do not match',
    userNotFound: 'User not found',
    wrongPassword: 'Incorrect password',
    userAlreadyExists: 'User already exists',
    networkError: 'Network error, please try again later',
    serverError: 'Internal server error',
  },
};

export type ApiMessageKey = keyof typeof apiMessages['zh-CN'];

export function getApiMessage(locale: 'zh-CN' | 'en-US', key: ApiMessageKey): string {
  return apiMessages[locale][key] || apiMessages['zh-CN'][key] || key;
}
