// 测试登录API的简单脚本
const BASE_URL = 'http://localhost:3002';

async function testLoginAPI() {
  console.log('🚀 开始测试登录API...\n');

  // 测试用例1: 成功登录
  console.log('📝 测试用例1: 成功登录');
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nickname: 'admin',
        password: '123456'
      })
    });
    
    const data = await response.json();
    console.log('状态码:', response.status);
    console.log('响应数据:', JSON.stringify(data, null, 2));
    console.log('✅ 测试通过\n');
  } catch (error) {
    console.log('❌ 测试失败:', error.message);
    console.log('');
  }

  // 测试用例2: 用户不存在
  console.log('📝 测试用例2: 用户不存在');
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nickname: 'nonexistent',
        password: '123456'
      })
    });
    
    const data = await response.json();
    console.log('状态码:', response.status);
    console.log('响应数据:', JSON.stringify(data, null, 2));
    console.log('✅ 测试通过\n');
  } catch (error) {
    console.log('❌ 测试失败:', error.message);
    console.log('');
  }

  // 测试用例3: 密码错误
  console.log('📝 测试用例3: 密码错误');
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nickname: 'admin',
        password: 'wrongpassword'
      })
    });
    
    const data = await response.json();
    console.log('状态码:', response.status);
    console.log('响应数据:', JSON.stringify(data, null, 2));
    console.log('✅ 测试通过\n');
  } catch (error) {
    console.log('❌ 测试失败:', error.message);
    console.log('');
  }

  // 测试用例4: 参数验证
  console.log('📝 测试用例4: 参数验证（空昵称）');
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nickname: '',
        password: '123456'
      })
    });
    
    const data = await response.json();
    console.log('状态码:', response.status);
    console.log('响应数据:', JSON.stringify(data, null, 2));
    console.log('✅ 测试通过\n');
  } catch (error) {
    console.log('❌ 测试失败:', error.message);
    console.log('');
  }
}

async function testUsersAPI() {
  console.log('🚀 开始测试用户API...\n');

  // 测试获取用户列表
  console.log('📝 测试用例: 获取用户列表');
  try {
    const response = await fetch(`${BASE_URL}/api/users`);
    const data = await response.json();
    console.log('状态码:', response.status);
    console.log('响应数据:', JSON.stringify(data, null, 2));
    console.log('✅ 测试通过\n');
  } catch (error) {
    console.log('❌ 测试失败:', error.message);
    console.log('');
  }

  // 测试获取单个用户
  console.log('📝 测试用例: 获取单个用户');
  try {
    const response = await fetch(`${BASE_URL}/api/users/user_001`);
    const data = await response.json();
    console.log('状态码:', response.status);
    console.log('响应数据:', JSON.stringify(data, null, 2));
    console.log('✅ 测试通过\n');
  } catch (error) {
    console.log('❌ 测试失败:', error.message);
    console.log('');
  }
}

// 运行测试
async function runTests() {
  await testLoginAPI();
  await testUsersAPI();
  console.log('🎉 所有测试完成！');
}

runTests().catch(console.error);