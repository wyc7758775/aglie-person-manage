import { Inter, Lusitana, Noto_Sans_SC, Poppins, JetBrains_Mono } from "next/font/google";

// 主要字体 - 支持中英文的现代无衬线字体
export const notoSansSC = Noto_Sans_SC({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600", "700"],
  display: 'swap',
});

// 英文标题字体 - 现代化设计
export const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600", "700"],
  display: 'swap',
});

// 代码字体 - 等宽字体
export const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600"],
  display: 'swap',
});

// 保留原有字体以兼容现有代码
export const inter = Inter({ subsets: ["latin"] });
export const lusitana = Lusitana({ weight: "400", subsets: ["latin"] });
