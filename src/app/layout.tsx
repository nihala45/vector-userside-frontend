import "./globals.css";
import ClientWrapper from "./providers/ClientWrapper";

export const metadata = {
  title: "E-Learning App",
  description: "Vector E-learning platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}
