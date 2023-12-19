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
import Sidebar from "./Sidebar";

const NavBar = () => {
  const { theme } = useTheme();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const toggleSidebar = () => setShowSidebar(!showSidebar);
  // const [showSignInDialog, setShowSignInDialog] = useState(false);

  return (
    <>
      <div className="z-20 h-full w-full max-w-screen-2xl bg-background px-8 py-4">
        <div className=" flex flex-wrap items-center justify-between gap-3">
          <button onClick={toggleSidebar} className="lg:hidden">
            <LayoutDashboard />
          </button>
          <Link href="/recipes" className="flex items-center gap-1">
            {/* //!Add Logo, show only logo on smaller screens */}
            {/* <span>Logo</span> */}
            <span className="font-ysabeau text-2xl font-extrabold tracking-wide lg:text-4xl">
              Spicify
            </span>
          </Link>
          <div className="flex items-center gap-2">
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
          </div>
        </div>
      </div>
      <AddRecipe open={showAddDialog} setOpen={setShowAddDialog} />
      {showSidebar && (
        <aside
          className={`fixed inset-0 block h-screen w-screen bg-background/80 backdrop-blur-sm lg:hidden  `}
        >
          <section className="fixed inset-0 w-24 block h-full bg-background ">
            <Sidebar setShowSidebar={setShowSidebar} />
          </section>
        </aside>
      )}
      <section className="fixed inset-0 hidden w-24 bg-background h-full lg:block ">
        <Sidebar setShowSidebar={setShowSidebar} />
      </section>
    </>
  );
};

export default NavBar;
