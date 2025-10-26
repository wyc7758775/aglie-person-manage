import { lusitana } from "@/app/ui/fonts";

export default function HabiticaLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center justify-center leading-none text-white`}
    >
      {/* 抽象太阳Logo - 基于登录界面的橙色圆形元素 */}
      <svg 
        className="h-7 w-7" 
        viewBox="0 0 100 100" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 定义渐变 */}
        <defs>
          <radialGradient id="sunGradient" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#fed7aa" />
            <stop offset="50%" stopColor="#fb923c" />
            <stop offset="100%" stopColor="#ea580c" />
          </radialGradient>
          <radialGradient id="coreGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="100%" stopColor="#f59e0b" />
          </radialGradient>
        </defs>
        
        {/* 外层光芒 - 8个方向的光线 */}
        <g opacity="0.6">
          {/* 主要方向光芒 */}
          <line x1="50" y1="8" x2="50" y2="18" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" />
          <line x1="50" y1="82" x2="50" y2="92" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" />
          <line x1="8" y1="50" x2="18" y2="50" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" />
          <line x1="82" y1="50" x2="92" y2="50" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" />
          
          {/* 对角线光芒 */}
          <line x1="21.5" y1="21.5" x2="28.5" y2="28.5" stroke="#fb923c" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="78.5" y1="21.5" x2="71.5" y2="28.5" stroke="#fb923c" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="21.5" y1="78.5" x2="28.5" y2="71.5" stroke="#fb923c" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="78.5" y1="78.5" x2="71.5" y2="71.5" stroke="#fb923c" strokeWidth="1.5" strokeLinecap="round" />
        </g>
        
        {/* 主体太阳圆形 */}
        <circle 
          cx="50" 
          cy="50" 
          r="22" 
          fill="url(#sunGradient)"
          className="drop-shadow-sm"
        />
        
        {/* 内部核心 */}
        <circle 
          cx="50" 
          cy="50" 
          r="12" 
          fill="url(#coreGradient)"
          opacity="0.8"
        />
        
        {/* 内部装饰点 - 模仿登录界面的小圆点 */}
        <circle 
          cx="58" 
          cy="42" 
          r="3" 
          fill="#fef3c7"
          opacity="0.7"
        />
        
        {/* 微小的高光点 */}
        <circle 
          cx="46" 
          cy="44" 
          r="1.5" 
          fill="#ffffff"
          opacity="0.9"
        />
      </svg>
    </div>
  );
}
