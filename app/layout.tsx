import "@/app/ui/global.css";
import { notoSansSC } from "@/app/ui/fonts";
import { LanguageProvider } from "@/app/lib/i18n";
import { AuthProvider } from "@/app/lib/hooks/useAuth";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${notoSansSC.className} antialiased`}>
        <LanguageProvider>
          <AuthProvider>{children}</AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
