/**
 * 图标组件库
 * 统一管理所有SVG图标，提供一致的接口和样式
 */

import React from 'react';

// 图标组件的通用属性接口
interface IconProps {
  className?: string;
  size?: number;
  color?: string;
}

// 用户图标
export const UserIcon: React.FC<IconProps> = ({ 
  className = "h-5 w-5", 
  color = "currentColor" 
}) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke={color}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

// 锁定图标
export const LockIcon: React.FC<IconProps> = ({ 
  className = "h-5 w-5", 
  color = "currentColor" 
}) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke={color}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

// 眼睛关闭图标（隐藏密码）
export const EyeOffIcon: React.FC<IconProps> = ({ 
  className = "w-5 h-5", 
  color = "currentColor" 
}) => (
  <svg
    className={className}
    fill="none"
    stroke={color}
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
    />
  </svg>
);

// 眼睛打开图标（显示密码）
export const EyeIcon: React.FC<IconProps> = ({ 
  className = "w-5 h-5", 
  color = "currentColor" 
}) => (
  <svg
    className={className}
    fill="none"
    stroke={color}
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

// 右箭头图标
export const ChevronRightIcon: React.FC<IconProps> = ({ 
  className = "w-4 h-4", 
  color = "currentColor" 
}) => (
  <svg
    className={className}
    fill="none"
    stroke={color}
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);

// 星星图标
export const StarIcon: React.FC<IconProps> = ({ 
  className = "w-4 h-4", 
  color = "currentColor" 
}) => (
  <svg 
    className={className}
    viewBox="0 0 24 24" 
    fill={color}
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

// 图标映射对象，方便按名称获取图标
export const Icons = {
  user: UserIcon,
  lock: LockIcon,
  eyeOff: EyeOffIcon,
  eye: EyeIcon,
  chevronRight: ChevronRightIcon,
  star: StarIcon,
} as const;

// 图标名称类型
export type IconName = keyof typeof Icons;

// 通用图标组件，可以通过名称动态渲染图标
export const Icon: React.FC<IconProps & { name: IconName }> = ({ 
  name, 
  ...props 
}) => {
  const IconComponent = Icons[name];
  return <IconComponent {...props} />;
};