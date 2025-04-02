import React from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "./ui/button";
import {
  PenBox,
  LayoutDashboard,
  FileText,
  GraduationCap,
  ChevronDown,
  StarsIcon,
} from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { checkUser } from "@/lib/checkUser";

export default async function Header() {
  await checkUser();

  return (
    <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50 supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/">
          <Image
            src="/logonew.jpg"
            alt="PrepMaster Logo"
            width={200}
            height={60}
            className="h-14 w-auto object-contain block dark:hidden"
          />
          <Image
            src="/logo_transparent.png"
            alt="PrepMaster Logo"
            width={200}
            height={60}
            className="h-14 w-auto object-contain hidden dark:block"
          />
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4 md:space-x-6">
          <SignedIn>
            <Link href="/dashboard">
              <Button
                variant="outline"
                className="hidden md:inline-flex items-center gap-2 px-4 py-2"
              >
                <LayoutDashboard className="h-5 w-5" />
                Industry Insights
              </Button>
              <Button variant="ghost" className="md:hidden w-12 h-12 p-0">
                <LayoutDashboard className="h-5 w-5" />
              </Button>
            </Link>

            {/* Growth Tools Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex items-center gap-2 px-4 py-2">
                  <StarsIcon className="h-5 w-5" />
                  <span className="hidden md:block">Growth Tools</span>
                  <ChevronDown className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 shadow-lg">
                <DropdownMenuItem asChild>
                  <Link href="/resume" className="flex items-center gap-2 p-2">
                    <FileText className="h-5 w-5" />
                    Build Resume
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/ai-cover-letter"
                    className="flex items-center gap-2 p-2"
                  >
                    <PenBox className="h-5 w-5" />
                    Cover Letter
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/interview"
                    className="flex items-center gap-2 p-2"
                  >
                    <GraduationCap className="h-5 w-5" />
                    Interview Prep
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SignedIn>
          <ThemeToggle />
          <SignedOut>
            <SignInButton>
              <Button variant="outline" className="px-4 py-2">
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-12 h-12",
                  userButtonPopoverCard: "shadow-xl",
                  userPreviewMainIdentifier: "font-semibold",
                },
              }}
              afterSignOutUrl="/"
            />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
}
