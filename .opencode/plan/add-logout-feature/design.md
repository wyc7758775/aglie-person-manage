# add-logout-feature 设计文档

## 实现方案

### 1. API路由设计

```typescript
// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // 可选：清除服务器端会话（如果有）
    
    return NextResponse.json({
      success: true,
      message: '退出成功'
    });
  } catch (error) {
    console.error('退出失败:', error);
    return NextResponse.json(
      { success: false, message: '退出失败' },
      { status: 500 }
    );
  }
}
```

### 2. TopNav修改

当前代码（第241行）：
```tsx
<Link href="/dashboard/reward">
  <div className="w-10 h-10 flex items-center justify-center transition-all duration-300 ease-in-out rounded-full">
    {/* 退出登录图标 */}
    <svg>...</svg>
  </div>
</Link>
```

修改为：
```tsx
<button
  onClick={handleLogout}
  className="w-10 h-10 flex items-center justify-center transition-all duration-300 ease-in-out rounded-full bg-transparent border-none cursor-pointer"
>
  {/* 退出登录图标 */}
  <svg>...</svg>
</button>
```

### 3. 退出处理函数

```typescript
const handleLogout = async () => {
  try {
    // 清除localStorage中的认证信息
    localStorage.removeItem('lastLoginNickname');
    localStorage.removeItem('lastLoginPassword');
    
    // 调用退出API（可选）
    await fetch('/api/auth/logout', { method: 'POST' });
    
    // 重定向到登录页面
    router.push('/');
  } catch (error) {
    console.error('退出失败:', error);
    // 即使API失败也要清除本地状态并跳转
    router.push('/');
  }
};
```

## 修改文件清单

| 文件 | 修改内容 |
|------|----------|
| `app/api/auth/logout/route.ts` | 新建 |
| `app/ui/dashboard/topnav.tsx` | 修改第241行及添加处理函数 |

## 测试场景

1. **正常退出流程**
   - 点击退出图标
   - localStorage被清除
   - 页面跳转到登录页
   - 直接访问Dashboard被重定向

2. **网络异常处理**
   - API调用失败时仍执行本地清除
   - 用户仍能正常退出
