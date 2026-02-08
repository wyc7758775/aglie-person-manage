import SideNav from "@/app/ui/dashboard/topnav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* 左侧导航栏 */}
      <SideNav />
      {/* 主要内容区域 */}
      <div className="pl-20 w-full h-full bg-[#f4f1ec] overflow-auto">{children}</div>
    </div>
  );
}
