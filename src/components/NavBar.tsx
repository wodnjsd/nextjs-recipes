"use client";

import AddRecipe from "@/components/AddEditDialog";
import ThemeToggleButton from "@/components/ThemeToggleButton";
import { Button } from "@/components/ui/button";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Plus, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import AIChatButton from "@/components/AIChatButton";
import Sidebar from "./Sidebar";
import { CldUploadButton } from "next-cloudinary";

const NavBar = () => {
  const { theme } = useTheme();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const toggleSidebar = () => setShowSidebar(!showSidebar);
  // const [showSignInDialog, setShowSignInDialog] = useState(false);

  return (
    <>
      <div className="w-screen max-w-screen-2xl px-8 py-4 shadow">
        <div className=" flex flex-wrap items-center justify-between gap-3">
          <button onClick={toggleSidebar} className="z-40 lg:hidden">
            <LayoutDashboard />
          </button>
          <Link href="/recipes" className="flex items-center gap-1">
            {/* //!Add Logo, show only logo on smaller screens */}
            {/* <span>Logo</span> */}
            <span className="font-playfair text-2xl font-extrabold tracking-wide lg:text-4xl">
              Spicify
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <CldUploadButton
              uploadPreset="recipes"
              options={{
                sources: ["local", "url", "unsplash", "camera"],
              }}
            />
            <ThemeToggleButton />
            {/* Show User button and Add button if user is signed in */}
            <SignedIn>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  baseTheme: theme === "dark" ? dark : undefined,
                  elements: {
                    avatarBox: { width: "2.5rem", height: "2.5rem" },
                  },
                }}
              />
              <Button
                type="button"
                onClick={() => setShowAddDialog(true)}
                className="hidden lg:flex"
              >
                <Plus size={20} className="mr-2" />
                Add Recipe
              </Button>
            </SignedIn>
            <SignedOut>
              {/* Signed out users get sign in button */}
              <SignInButton>
                <Button>Sign In</Button>
              </SignInButton>
            </SignedOut>
            <section className="hidden lg:flex">
              <AIChatButton />
            </section>
          </div>
        </div>
      </div>
      <AddRecipe open={showAddDialog} setOpen={setShowAddDialog} />
      {showSidebar && (
        <aside className="fixed inset-0 h-screen w-screen bg-background/80 backdrop-blur-sm">
          <section className="fixed h-full">
            <Sidebar />
          </section>
        </aside>
      )}
    </>
  );
};

export default NavBar;
