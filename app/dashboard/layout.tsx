import TopNav from "@/app/ui/dashboard/topnav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#F9FFD3]/30">
      <TopNav />
      <div className="flex-grow overflow-hidden p-4 bg-white/90 rounded-t-2xl shadow-inner border-t border-[#EE3F4D]/20">
        {children}
      </div>
    </div>
  );
}
