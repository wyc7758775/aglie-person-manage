import { lusitana } from "@/app/ui/fonts";

export default function HabiticaLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center justify-center leading-none text-white`}
    >
      {/* 马赛克版本的皮卡丘SVG */}
      <svg 
        className="h-7 w-7" 
        viewBox="0 0 100 100" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 皮卡丘的马赛克身体 - 黄色方块 */}
        <rect x="20" y="20" width="15" height="15" fill="#FFD700" />
        <rect x="35" y="20" width="15" height="15" fill="#FFDE2E" />
        <rect x="50" y="20" width="15" height="15" fill="#FFD700" />
        <rect x="65" y="20" width="15" height="15" fill="#FFDE2E" />
        
        <rect x="20" y="35" width="15" height="15" fill="#FFDE2E" />
        <rect x="35" y="35" width="15" height="15" fill="#FFD700" />
        <rect x="50" y="35" width="15" height="15" fill="#FFDE2E" />
        <rect x="65" y="35" width="15" height="15" fill="#FFD700" />
        
        <rect x="20" y="50" width="15" height="15" fill="#FFD700" />
        <rect x="35" y="50" width="15" height="15" fill="#FFDE2E" />
        <rect x="50" y="50" width="15" height="15" fill="#FFD700" />
        <rect x="65" y="50" width="15" height="15" fill="#FFDE2E" />
        
        {/* 皮卡丘的耳朵 - 黑色尖尖 */}
        <rect x="20" y="5" width="15" height="15" fill="#000" />
        <rect x="65" y="5" width="15" height="15" fill="#000" />
        
        {/* 皮卡丘的脸部特征 - 红色腮红和黑色眼睛 */}
        <rect x="20" y="65" width="15" height="15" fill="#FF6347" />
        <rect x="65" y="65" width="15" height="15" fill="#FF6347" />
        <rect x="35" y="35" width="15" height="15" fill="#000" />
        <rect x="50" y="35" width="15" height="15" fill="#000" />
        
        {/* 皮卡丘的嘴巴 */}
        <rect x="42.5" y="65" width="15" height="15" fill="#000" />
      </svg>
    </div>
  );
}
