import TopNav from "@/app/ui/dashboard/topnav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <TopNav />
      <div className="flex-grow overflow-hidden">{children}</div>
    </div>
  );
}
