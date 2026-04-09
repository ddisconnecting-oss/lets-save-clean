import { ClerkProvider } from "@clerk/nextjs";
import { ExpenseProvider } from "@/context/ExpenseContext";
import "./globals.css";

export default function RootLayout({ children }: any) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <ExpenseProvider>{children}</ExpenseProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}