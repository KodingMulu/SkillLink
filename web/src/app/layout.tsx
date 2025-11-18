import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SkillLink | Freelance for Students",
  description: "Students | Collaboration | Freelance for Students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
