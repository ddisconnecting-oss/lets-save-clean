import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ExpenseProvider } from "@/context/ExpenseContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <ExpenseProvider>
        <html lang="en" suppressHydrationWarning>
          <body>{children}</body>
        </html>
      </ExpenseProvider>
    </ClerkProvider>
  );
}