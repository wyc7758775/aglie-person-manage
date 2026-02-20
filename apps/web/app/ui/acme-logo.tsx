export default function HabiticaLogo() {
  return (
    <div className="flex flex-col items-center">
      {/* 复古徽章 Logo */}
      <div className="relative w-12 h-12 mb-2">
        <svg 
          className="w-full h-full" 
          viewBox="0 0 40 40"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* 复古渐变 */}
            <linearGradient id="bronzeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d4a574" />
              <stop offset="30%" stopColor="#b8956a" />
              <stop offset="60%" stopColor="#8b6914" />
              <stop offset="100%" stopColor="#654321" />
            </linearGradient>
            
            {/* 噪点纹理 */}
            <filter id="vintageNoise">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" />
              <feColorMatrix type="saturate" values="0" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.15" />
              </feComponentTransfer>
            </filter>
          </defs>
          
          {/* 主圆形徽章 */}
          <circle 
            cx="20" 
            cy="20" 
            r="18" 
            fill="url(#bronzeGradient)" 
            stroke="#5d4e37" 
            strokeWidth="1"
          />
          
          {/* 内圈装饰线 */}
          <circle 
            cx="20" 
            cy="20" 
            r="15" 
            fill="none" 
            stroke="#f5f5dc" 
            strokeWidth="0.5"
            opacity="0.6"
          />
          
          {/* 中心 "B" 字母 - 打字机风格 */}
          <text
            x="20"
            y="24"
            textAnchor="middle"
            fontFamily="Courier New, Courier, monospace"
            fontSize="14"
            fontWeight="bold"
            fill="#3d2914"
            style={{ letterSpacing: '-1px' }}
          >
            B
          </text>
          
          {/* 小圆点（代表"运行"状态） */}
          <circle cx="20" cy="12" r="2" fill="#e8b923" opacity="0.9" />
          
          {/* 复古噪点纹理覆盖 */}
          <rect 
            x="0" 
            y="0" 
            width="40" 
            height="40" 
            fill="transparent"
            filter="url(#vintageNoise)"
            opacity="0.3"
          />
        </svg>
      </div>
      
      {/* 品牌文字 */}
      <div className="flex flex-col items-center">
        <span 
          className="text-xs font-bold tracking-widest text-white" 
          style={{ fontFamily: 'Courier New, Courier, monospace' }}
        >
          BE.RUN
        </span>
        <span className="text-[8px] tracking-[0.15em] text-white/70 mt-1 uppercase">
          Agile Life
        </span>
      </div>
    </div>
  );
}
