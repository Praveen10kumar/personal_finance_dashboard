import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { LayoutDashboard, Link, PenBox } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";
import { checkUser } from "@/lib/checkUser";

const Header = async () => {

  await checkUser();

  return (
    <div className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <nav className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/">
          <Image src="/logo.png" alt="Logo" height={50} width={150} className="h-12 w-auto object-contain"/>
        </Link>


        <div className="flex items-center space-x-4">
            <SignedIn>
              <Link href={"/dashboard"} className="text-gray-800 hover:text-blue-600 flex items-center gap-2">
                <Button variant="outline">
                    <LayoutDashboard size={15} />
                  <p className="hidden md:inline">Dashboard</p>
                </Button>
              </Link>

              <Link href={"/transaction/create"} className="text-gray-800 hover:text-blue-600">
                <Button className="flex items-center gap-2">
                    <PenBox size={15} />
                  <p className="hidden md:inline">Create Transaction</p>
                </Button>
              </Link>
            </SignedIn>
          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button variant="outline">
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton>
              <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton appearance={{ elements: { 
                avatarBox: "h-10 w-10", 
             } }} />
          </SignedIn>
        </div>
      </nav>
    </div>
  )
}

export default Header
