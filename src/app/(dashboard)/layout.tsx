import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import NextTopLoader from "nextjs-toploader";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/actions/auth";
import Navbar from "@/components/ui/navbar";
import { SidebarProvider } from "@/components/providers/sidebar-provider";
import MainContainer from "@/components/main-container";
import QueryProvider from "@/components/providers/query-provider";
import { UserDetailsProvider } from "@/components/providers/user-details-provider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard",
};

export default async function RootLayoutHome({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  const user = await getUser();
  if (!user || !user.user) {
    console.error("user not found. redirecting to login");
    return redirect("/login");
  }
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("overflow-y-hidden", inter.className)}>
        <NextTopLoader showSpinner={false} />
        <ThemeProvider
          defaultTheme="system"
          attribute="class"
          disableTransitionOnChange
          enableSystem
        >
          <ToastContainer
            autoClose={3000}
            position="bottom-center"
            hideProgressBar
            theme=""
            bodyClassName="dark:text-white text-black "
            toastClassName="dark:text-white text-black border-b-[6px] border-black dark:border-gray-300 dark:bg-black bg-gray-100 dark:bg-slate-900 shadow-lg"
          />
          <QueryProvider>
            <UserDetailsProvider details={user.user}>
              <SidebarProvider>
                <MainContainer>
                  <Sidebar />
                  <div className="flex flex-col flex-1 w-full">
                    <Navbar />
                    <main className="h-[100dvh] overflow-y-auto">
                      <div className="p-4">
                        {modal}
                        {children}
                      </div>
                    </main>
                  </div>
                </MainContainer>
              </SidebarProvider>
            </UserDetailsProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
