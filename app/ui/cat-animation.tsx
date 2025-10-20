import React from 'react';

/**
 * 小猫咪动画组件
 * 创建可爱的小猫咪动画效果作为背景
 */
export default function CatAnimation() {
  return (
    <div className="cat-container">
      {/* 左侧小猫 */}
      <div className="cat cat-left">
        <svg width="120" height="120" viewBox="0 0 120 120" className="dancing-cat">
          <g transform="translate(10, 10)">
            {/* 猫咪身体 */}
            <ellipse cx="50" cy="55" rx="30" ry="25" fill="#9E9E9E" className="cat-body" />
            
            {/* 猫咪头部 */}
            <circle cx="50" cy="30" r="20" fill="#9E9E9E" />
            
            {/* 猫咪耳朵 */}
            <path d="M35 15 L30 5 L40 15" fill="#9E9E9E" stroke="#000" strokeWidth="0.5" className="cat-ear-left" />
            <path d="M65 15 L70 5 L60 15" fill="#9E9E9E" stroke="#000" strokeWidth="0.5" className="cat-ear-right" />
            <path d="M35 15 L33 8 L38 14" fill="#FFC0CB" stroke="#FFC0CB" strokeWidth="0.5" />
            <path d="M65 15 L67 8 L62 14" fill="#FFC0CB" stroke="#FFC0CB" strokeWidth="0.5" />
            
            {/* 猫咪尾巴 */}
            <path d="M80 55 C90 45, 95 60, 85 65" fill="none" stroke="#9E9E9E" strokeWidth="6" strokeLinecap="round" className="cat-tail" />
            
            {/* 猫咪脸 */}
            <circle cx="43" cy="28" r="4" fill="#000" /> {/* 左眼 */}
            <circle cx="57" cy="28" r="4" fill="#000" /> {/* 右眼 */}
            <circle cx="43" cy="26" r="1" fill="#FFF" /> {/* 左眼高光 */}
            <circle cx="57" cy="26" r="1" fill="#FFF" /> {/* 右眼高光 */}
            <ellipse cx="50" cy="35" rx="3" ry="2" fill="#FF9999" /> {/* 鼻子 */}
            <path d="M50 37 L50 40 M47 42 C48.5 44, 51.5 44, 53 42" fill="none" stroke="#000" strokeWidth="0.7" /> {/* 嘴 */}
            
            {/* 猫咪胡须 */}
            <path d="M47 35 L37 33 M47 36 L37 36 M47 37 L37 39" fill="none" stroke="#000" strokeWidth="0.5" className="cat-whiskers-left" />
            <path d="M53 35 L63 33 M53 36 L63 36 M53 37 L63 39" fill="none" stroke="#000" strokeWidth="0.5" className="cat-whiskers-right" />
            
            {/* 猫咪腿 */}
            <path d="M35 75 L30 85" stroke="#9E9E9E" strokeWidth="6" strokeLinecap="round" className="cat-leg-left" />
            <path d="M65 75 L70 85" stroke="#9E9E9E" strokeWidth="6" strokeLinecap="round" className="cat-leg-right" />
            
            {/* 猫咪前爪 */}
            <path d="M40 60 L30 70" stroke="#9E9E9E" strokeWidth="6" strokeLinecap="round" className="cat-paw-left" />
            <path d="M60 60 L70 70" stroke="#9E9E9E" strokeWidth="6" strokeLinecap="round" className="cat-paw-right" />
          </g>
        </svg>
      </div>
      
      {/* 右侧小猫 */}
      <div className="cat cat-right">
        <svg width="120" height="120" viewBox="0 0 120 120" className="dancing-cat">
          <g transform="translate(10, 10)">
            {/* 猫咪身体 */}
            <ellipse cx="50" cy="55" rx="30" ry="25" fill="#FFD700" className="cat-body" />
            
            {/* 猫咪头部 */}
            <circle cx="50" cy="30" r="20" fill="#FFD700" />
            
            {/* 猫咪耳朵 */}
            <path d="M35 15 L30 5 L40 15" fill="#FFD700" stroke="#000" strokeWidth="0.5" className="cat-ear-left" />
            <path d="M65 15 L70 5 L60 15" fill="#FFD700" stroke="#000" strokeWidth="0.5" className="cat-ear-right" />
            <path d="M35 15 L33 8 L38 14" fill="#FFC0CB" stroke="#FFC0CB" strokeWidth="0.5" />
            <path d="M65 15 L67 8 L62 14" fill="#FFC0CB" stroke="#FFC0CB" strokeWidth="0.5" />
            
            {/* 猫咪尾巴 */}
            <path d="M80 55 C90 45, 95 60, 85 65" fill="none" stroke="#FFD700" strokeWidth="6" strokeLinecap="round" className="cat-tail" />
            
            {/* 猫咪脸 */}
            <circle cx="43" cy="28" r="4" fill="#000" /> {/* 左眼 */}
            <circle cx="57" cy="28" r="4" fill="#000" /> {/* 右眼 */}
            <circle cx="43" cy="26" r="1" fill="#FFF" /> {/* 左眼高光 */}
            <circle cx="57" cy="26" r="1" fill="#FFF" /> {/* 右眼高光 */}
            <ellipse cx="50" cy="35" rx="3" ry="2" fill="#FF9999" /> {/* 鼻子 */}
            <path d="M50 37 L50 40 M47 42 C48.5 44, 51.5 44, 53 42" fill="none" stroke="#000" strokeWidth="0.7" /> {/* 嘴 */}
            
            {/* 猫咪胡须 */}
            <path d="M47 35 L37 33 M47 36 L37 36 M47 37 L37 39" fill="none" stroke="#000" strokeWidth="0.5" className="cat-whiskers-left" />
            <path d="M53 35 L63 33 M53 36 L63 36 M53 37 L63 39" fill="none" stroke="#000" strokeWidth="0.5" className="cat-whiskers-right" />
            
            {/* 猫咪腿 */}
            <path d="M35 75 L30 85" stroke="#FFD700" strokeWidth="6" strokeLinecap="round" className="cat-leg-left" />
            <path d="M65 75 L70 85" stroke="#FFD700" strokeWidth="6" strokeLinecap="round" className="cat-leg-right" />
            
            {/* 猫咪前爪 */}
            <path d="M40 60 L30 70" stroke="#FFD700" strokeWidth="6" strokeLinecap="round" className="cat-paw-left" />
            <path d="M60 60 L70 70" stroke="#FFD700" strokeWidth="6" strokeLinecap="round" className="cat-paw-right" />
          </g>
        </svg>
      </div>
      
      {/* 底部小猫 */}
      <div className="cat cat-bottom">
        <svg width="120" height="120" viewBox="0 0 120 120" className="dancing-cat">
          <g transform="translate(10, 10)">
            {/* 猫咪身体 */}
            <ellipse cx="50" cy="55" rx="30" ry="25" fill="#FF69B4" className="cat-body" />
            
            {/* 猫咪头部 */}
            <circle cx="50" cy="30" r="20" fill="#FF69B4" />
            
            {/* 猫咪耳朵 */}
            <path d="M35 15 L30 5 L40 15" fill="#FF69B4" stroke="#000" strokeWidth="0.5" className="cat-ear-left" />
            <path d="M65 15 L70 5 L60 15" fill="#FF69B4" stroke="#000" strokeWidth="0.5" className="cat-ear-right" />
            <path d="M35 15 L33 8 L38 14" fill="#FFC0CB" stroke="#FFC0CB" strokeWidth="0.5" />
            <path d="M65 15 L67 8 L62 14" fill="#FFC0CB" stroke="#FFC0CB" strokeWidth="0.5" />
            
            {/* 猫咪尾巴 */}
            <path d="M80 55 C90 45, 95 60, 85 65" fill="none" stroke="#FF69B4" strokeWidth="6" strokeLinecap="round" className="cat-tail" />
            
            {/* 猫咪脸 */}
            <circle cx="43" cy="28" r="4" fill="#000" /> {/* 左眼 */}
            <circle cx="57" cy="28" r="4" fill="#000" /> {/* 右眼 */}
            <circle cx="43" cy="26" r="1" fill="#FFF" /> {/* 左眼高光 */}
            <circle cx="57" cy="26" r="1" fill="#FFF" /> {/* 右眼高光 */}
            <ellipse cx="50" cy="35" rx="3" ry="2" fill="#FF9999" /> {/* 鼻子 */}
            <path d="M50 37 L50 40 M47 42 C48.5 44, 51.5 44, 53 42" fill="none" stroke="#000" strokeWidth="0.7" /> {/* 嘴 */}
            
            {/* 猫咪胡须 */}
            <path d="M47 35 L37 33 M47 36 L37 36 M47 37 L37 39" fill="none" stroke="#000" strokeWidth="0.5" className="cat-whiskers-left" />
            <path d="M53 35 L63 33 M53 36 L63 36 M53 37 L63 39" fill="none" stroke="#000" strokeWidth="0.5" className="cat-whiskers-right" />
            
            {/* 猫咪腿 */}
            <path d="M35 75 L30 85" stroke="#FF69B4" strokeWidth="6" strokeLinecap="round" className="cat-leg-left" />
            <path d="M65 75 L70 85" stroke="#FF69B4" strokeWidth="6" strokeLinecap="round" className="cat-leg-right" />
            
            {/* 猫咪前爪 */}
            <path d="M40 60 L30 70" stroke="#FF69B4" strokeWidth="6" strokeLinecap="round" className="cat-paw-left" />
            <path d="M60 60 L70 70" stroke="#FF69B4" strokeWidth="6" strokeLinecap="round" className="cat-paw-right" />
          </g>
        </svg>
      </div>
    </div>
  );
}