import "@/app/ui/global.css";
import { notoSansSC } from "@/app/ui/fonts";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${notoSansSC.className} antialiased`}>{children}</body>
    </html>
  );
}
