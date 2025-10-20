import React from 'react';

/**
 * 皮卡丘动画组件
 * 创建可爱的皮卡丘动画效果作为背景
 */
export default function PikachuAnimation() {
  return (
    <div className="pikachu-container">
      {/* 左侧皮卡丘 */}
      <div className="pikachu pikachu-left">
        <svg width="120" height="120" viewBox="0 0 120 120" className="dancing-pikachu">
          <g transform="translate(10, 10)">
            {/* 皮卡丘身体 */}
            <ellipse cx="50" cy="50" rx="35" ry="30" fill="#FFF000" />
            
            {/* 皮卡丘耳朵 */}
            <path d="M30 25 L15 5 L25 25 Z" fill="#FFF000" stroke="#000" strokeWidth="1" />
            <path d="M70 25 L85 5 L75 25 Z" fill="#FFF000" stroke="#000" strokeWidth="1" />
            
            {/* 皮卡丘尾巴 */}
            <path d="M85 45 L100 35 L95 50 L105 55 L90 60" fill="#FFF000" stroke="#000" strokeWidth="1" className="pikachu-tail" />
            
            {/* 皮卡丘脸 */}
            <circle cx="40" cy="40" r="5" fill="#000" /> {/* 左眼 */}
            <circle cx="60" cy="40" r="5" fill="#000" /> {/* 右眼 */}
            <ellipse cx="50" cy="55" rx="5" ry="3" fill="#FF0000" /> {/* 嘴 */}
            <circle cx="30" cy="35" r="7" fill="#FF0000" className="pikachu-cheek" /> {/* 左脸颊 */}
            <circle cx="70" cy="35" r="7" fill="#FF0000" className="pikachu-cheek" /> {/* 右脸颊 */}
            
            {/* 皮卡丘手臂 */}
            <path d="M25 50 L10 60" stroke="#FFF000" strokeWidth="10" strokeLinecap="round" className="pikachu-arm-left" />
            <path d="M75 50 L90 60" stroke="#FFF000" strokeWidth="10" strokeLinecap="round" className="pikachu-arm-right" />
            
            {/* 皮卡丘腿 */}
            <path d="M40 75 L35 90" stroke="#FFF000" strokeWidth="10" strokeLinecap="round" className="pikachu-leg-left" />
            <path d="M60 75 L65 90" stroke="#FFF000" strokeWidth="10" strokeLinecap="round" className="pikachu-leg-right" />
          </g>
        </svg>
      </div>
      
      {/* 右侧皮卡丘 */}
      <div className="pikachu pikachu-right">
        <svg width="120" height="120" viewBox="0 0 120 120" className="dancing-pikachu">
          <g transform="translate(10, 10)">
            {/* 皮卡丘身体 */}
            <ellipse cx="50" cy="50" rx="35" ry="30" fill="#FFF000" />
            
            {/* 皮卡丘耳朵 */}
            <path d="M30 25 L15 5 L25 25 Z" fill="#FFF000" stroke="#000" strokeWidth="1" />
            <path d="M70 25 L85 5 L75 25 Z" fill="#FFF000" stroke="#000" strokeWidth="1" />
            
            {/* 皮卡丘尾巴 */}
            <path d="M85 45 L100 35 L95 50 L105 55 L90 60" fill="#FFF000" stroke="#000" strokeWidth="1" className="pikachu-tail" />
            
            {/* 皮卡丘脸 */}
            <circle cx="40" cy="40" r="5" fill="#000" /> {/* 左眼 */}
            <circle cx="60" cy="40" r="5" fill="#000" /> {/* 右眼 */}
            <ellipse cx="50" cy="55" rx="5" ry="3" fill="#FF0000" /> {/* 嘴 */}
            <circle cx="30" cy="35" r="7" fill="#FF0000" className="pikachu-cheek" /> {/* 左脸颊 */}
            <circle cx="70" cy="35" r="7" fill="#FF0000" className="pikachu-cheek" /> {/* 右脸颊 */}
            
            {/* 皮卡丘手臂 */}
            <path d="M25 50 L10 60" stroke="#FFF000" strokeWidth="10" strokeLinecap="round" className="pikachu-arm-left" />
            <path d="M75 50 L90 60" stroke="#FFF000" strokeWidth="10" strokeLinecap="round" className="pikachu-arm-right" />
            
            {/* 皮卡丘腿 */}
            <path d="M40 75 L35 90" stroke="#FFF000" strokeWidth="10" strokeLinecap="round" className="pikachu-leg-left" />
            <path d="M60 75 L65 90" stroke="#FFF000" strokeWidth="10" strokeLinecap="round" className="pikachu-leg-right" />
          </g>
        </svg>
      </div>
      
      {/* 底部皮卡丘 */}
      <div className="pikachu pikachu-bottom">
        <svg width="120" height="120" viewBox="0 0 120 120" className="dancing-pikachu">
          <g transform="translate(10, 10)">
            {/* 皮卡丘身体 */}
            <ellipse cx="50" cy="50" rx="35" ry="30" fill="#FFF000" />
            
            {/* 皮卡丘耳朵 */}
            <path d="M30 25 L15 5 L25 25 Z" fill="#FFF000" stroke="#000" strokeWidth="1" />
            <path d="M70 25 L85 5 L75 25 Z" fill="#FFF000" stroke="#000" strokeWidth="1" />
            
            {/* 皮卡丘尾巴 */}
            <path d="M85 45 L100 35 L95 50 L105 55 L90 60" fill="#FFF000" stroke="#000" strokeWidth="1" className="pikachu-tail" />
            
            {/* 皮卡丘脸 */}
            <circle cx="40" cy="40" r="5" fill="#000" /> {/* 左眼 */}
            <circle cx="60" cy="40" r="5" fill="#000" /> {/* 右眼 */}
            <ellipse cx="50" cy="55" rx="5" ry="3" fill="#FF0000" /> {/* 嘴 */}
            <circle cx="30" cy="35" r="7" fill="#FF0000" className="pikachu-cheek" /> {/* 左脸颊 */}
            <circle cx="70" cy="35" r="7" fill="#FF0000" className="pikachu-cheek" /> {/* 右脸颊 */}
            
            {/* 皮卡丘手臂 */}
            <path d="M25 50 L10 60" stroke="#FFF000" strokeWidth="10" strokeLinecap="round" className="pikachu-arm-left" />
            <path d="M75 50 L90 60" stroke="#FFF000" strokeWidth="10" strokeLinecap="round" className="pikachu-arm-right" />
            
            {/* 皮卡丘腿 */}
            <path d="M40 75 L35 90" stroke="#FFF000" strokeWidth="10" strokeLinecap="round" className="pikachu-leg-left" />
            <path d="M60 75 L65 90" stroke="#FFF000" strokeWidth="10" strokeLinecap="round" className="pikachu-leg-right" />
          </g>
        </svg>
      </div>
    </div>
  );
}