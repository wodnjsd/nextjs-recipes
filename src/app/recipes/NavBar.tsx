"use client";

import AddRecipe from "@/components/AddEditDialog";
import ThemeToggleButton from "@/components/ThemeToggleButton";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

const NavBar = () => {
  const { theme } = useTheme();
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <div className="p-4 shadow">
        <div className="flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <Link href="/recipes" className="flex items-center gap-1">
            <span>Logo</span>
            <span className="font-bold">KimchiQueen</span>
          </Link>
          <div className="flex items-center gap-2">
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                baseTheme: theme === "dark" ? dark : undefined,
                elements: { avatarBox: { width: "2.5rem", height: "2.5rem" } },
              }}
            />
            <ThemeToggleButton />
            <Button onClick={() => setShowDialog(true)}>
              <Plus size={20} className="mr-2" />
              Add Recipe
            </Button>
          </div>
        </div>
      </div>
      <AddRecipe open={showDialog} setOpen={setShowDialog} />
    </>
  );
};

export default NavBar;
