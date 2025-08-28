import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        
        <h1 className="text-3xl font-bold text-center sm:text-left text-foreground">Welcome to ARMII Platform</h1>
        
        <h2 className="text-xl text-center sm:text-left text-foreground">Your Intelligent Management Solution</h2>
        
        <div className="flex flex-col gap-4 w-full max-w-md">
          <h2 className="text-xl font-semibold">Admin Panel</h2>
          <div className="flex flex-col gap-3">
            <Link
              className="rounded-md border border-solid border-transparent transition-colors flex items-center justify-center bg-orange-500 text-white gap-2 hover:bg-orange-600 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
              href="/admin/add-account-platform"
            >
              <div className="flex flex-col items-center">
                <span className="font-bold">1. Admin Add Account & Platform</span>
              </div>
            </Link>
            
            <Link
              className="rounded-md border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-600 text-white gap-2 hover:bg-blue-700 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
              href="/admin/set-account-platform"
            >
              <div className="flex flex-col items-center">
                <span className="font-bold">2. Set Account & Platform</span>
              </div>
            </Link>
            
            <Link
              className="rounded-md border border-solid border-transparent transition-colors flex items-center justify-center bg-green-600 text-white gap-2 hover:bg-green-700 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
              href="/admin/view-account-platform"
            >
              <div className="flex flex-col items-center">
                <span className="font-bold">3. View Accounts & Platforms</span>
              </div>
            </Link>
          </div>
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row mt-8">
          <Link
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px] text-foreground"
            href="/"
          >
            Get Started
          </Link>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center text-foreground">
         <p>© 2025 ARMII Platform. All rights reserved.</p>
        </footer>
    </div>
  );
}