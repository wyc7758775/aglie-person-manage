import "@/app/ui/global.css";
import { notoSansSC } from "@/app/ui/fonts";
import { LanguageProvider } from "@/app/lib/i18n";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${notoSansSC.className} antialiased`}>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
