export default function HabiticaLogo() {
  return (
    <div className="flex flex-col items-center">
      {/* 可爱活泼 Logo */}
      <div className="relative w-12 h-12 mb-2">
        <svg
          className="w-full h-full"
          viewBox="0 0 40 40"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* 糖果色渐变 */}
            <linearGradient id="candyGradient1" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#FF6B9D" />
              <stop offset="100%" stopColor="#FF8FB0" />
            </linearGradient>

            <linearGradient id="candyGradient2" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#C084FC" />
              <stop offset="100%" stopColor="#D8B4FE" />
            </linearGradient>

            <linearGradient id="candyGradient3" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#93C5FD" />
            </linearGradient>

            {/* 高光滤镜 */}
            <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* 可爱动画 */}
            <style>{`
              @keyframes bounce {
                0%, 100% { transform: translateY(0) scale(1); }
                50% { transform: translateY(-2px) scale(1.15); }
              }
              @keyframes wiggle {
                0%, 100% { transform: rotate(-3deg); }
                50% { transform: rotate(3deg); }
              }
              @keyframes twinkle {
                0%, 100% { opacity: 0.4; transform: scale(0.8); }
                50% { opacity: 1; transform: scale(1.2); }
              }
              @keyframes float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-1px); }
              }
              .dot1 { animation: bounce 2s ease-in-out infinite; transform-origin: 10px 30px; }
              .dot2 { animation: bounce 2s ease-in-out infinite 0.3s; transform-origin: 20px 20px; }
              .dot3 { animation: bounce 2s ease-in-out infinite 0.6s; transform-origin: 30px 10px; }
              .connector { animation: wiggle 3s ease-in-out infinite; transform-origin: center; }
              .star1 { animation: twinkle 1.5s ease-in-out infinite; }
              .star2 { animation: twinkle 1.5s ease-in-out infinite 0.5s; }
              .star3 { animation: twinkle 1.5s ease-in-out infinite 1s; }
            `}</style>
          </defs>

          {/* 连接线 - 粗圆润曲线 */}
          <path
            d="M 10 30 Q 15 24 20 19 Q 25 14 30 9"
            fill="none"
            stroke="url(#candyGradient2)"
            strokeWidth="3"
            strokeLinecap="round"
            className="connector"
            opacity="0.7"
          />

          {/* 底部圆点 - 大号糖果粉 */}
          <circle
            cx="10"
            cy="30"
            r="5"
            fill="url(#candyGradient1)"
            className="dot1"
            filter="url(#softGlow)"
          />
          {/* 圆点高光 */}
          <ellipse cx="8.5" cy="28" rx="1.5" ry="1" fill="white" opacity="0.6" className="dot1" />

          {/* 中间圆点 - 中号糖果紫 */}
          <circle
            cx="20"
            cy="19"
            r="5"
            fill="url(#candyGradient2)"
            className="dot2"
            filter="url(#softGlow)"
          />
          {/* 圆点高光 */}
          <ellipse cx="18.5" cy="17" rx="1.5" ry="1" fill="white" opacity="0.6" className="dot2" />

          {/* 顶部圆点 - 小号糖果蓝 */}
          <circle
            cx="30"
            cy="9"
            r="5"
            fill="url(#candyGradient3)"
            className="dot3"
            filter="url(#softGlow)"
          />
          {/* 圆点高光 */}
          <ellipse cx="28.5" cy="7" rx="1.5" ry="1" fill="white" opacity="0.6" className="dot3" />

          {/* 小星星装饰 */}
          <path
            d="M 6 8 L 7 11 L 10 11 L 7.5 13 L 8.5 16 L 6 14 L 3.5 16 L 4.5 13 L 2 11 L 5 11 Z"
            fill="#FCD34D"
            className="star1"
            opacity="0.8"
          />
          <path
            d="M 33 18 L 33.8 20 L 36 20 L 34.2 21.2 L 34.8 23.5 L 33 22.2 L 31.2 23.5 L 31.8 21.2 L 30 20 L 32.2 20 Z"
            fill="#F472B6"
            className="star2"
            opacity="0.8"
          />
          <circle cx="35" cy="6" r="1.5" fill="#60A5FA" className="star3" opacity="0.7" />
        </svg>
      </div>

      {/* 品牌文字 */}
      <div className="flex flex-col items-center">
        <span
          className="text-xs font-bold tracking-wider text-white"
          style={{ fontFamily: 'Quicksand, Nunito, system-ui, sans-serif' }}
        >
          AGILE
        </span>
        <span
          className="text-[8px] tracking-[0.2em] text-white/70 mt-1 uppercase"
          style={{ fontFamily: 'Quicksand, Nunito, system-ui, sans-serif' }}
        >
          ✨ Life Flow
        </span>
      </div>
    </div>
  );
}
