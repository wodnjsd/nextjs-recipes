"use client";
import Link from "next/link";
import {
  Home,
  Search,
  Heart,
  User,
  FilePlus2,
  FolderOpen,
  History,
  LogIn,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import AddEditDialog from "./AddEditDialog";
import { useState } from "react";
import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
  useAuth,
} from "@clerk/nextjs";
import SignInReminder from "./SignInReminder";

interface Props {
  setShowSidebar: (open: boolean) => void;
  // setShowAddDialog?: (open: boolean) => void;
  // showAddDialog?: boolean
}

const Sidebar = ({ setShowSidebar}: Props) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const { userId } = useAuth();

  const closeSidebar = () => {
    setShowSidebar(false);
  };

  return (
    <>
      <div className="h-screen overflow-auto overscroll-contain  border-r">
        <div className="flex h-full flex-col justify-between px-8 py-40 ">
          <div className="absolute -top-1 left-3 z-20 flex h-24 w-16 items-center justify-center bg-background lg:hidden">
            <button>
              <LayoutDashboard onClick={() => setShowSidebar(false)} />
            </button>
          </div>
          <div className="flex flex-col gap-10">
            <Link href="/" title="Home" onClick={closeSidebar}>
              <Home />
            </Link>
            {/* <Link href="/">
            <Search />
          </Link> */}
            <Link
              href="/dashboard/my-favourites"
              title="Favourites"
              onClick={closeSidebar}
            >
              <Heart />
            </Link>
            <Link
              href="/dashboard/my-recipes"
              title="My recipes"
              onClick={closeSidebar}
            >
              <FolderOpen />
            </Link>
            <button
              type="button"
              onClick={!userId? () => setShowSignIn(true) : () => setShowAddDialog!(true)}
              title="Add recipe"
            >
              <FilePlus2 />
            </button>
            <Link
              href="/dashboard/activity"
              title="My activity"
              onClick={closeSidebar}
            >
              <History />
            </Link>
            <Link
              href="/dashboard/profile"
              title="My profile"
              onClick={closeSidebar}
            >
              <User />
            </Link>
          </div>
          <div className="flex flex-col gap-10 py-24">
            <SignedOut>
              <SignInButton>
                <button title="Log in">
                  <LogIn />
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <SignOutButton>
                <button title="Log out">
                  <LogOut />
                </button>
              </SignOutButton>
            </SignedIn>
          </div>
        </div>
      </div>
      <AddEditDialog open={showAddDialog} setOpen={setShowAddDialog} closeSidebar={closeSidebar}/>
      {showSignIn && (
        <SignInReminder open={showSignIn} setOpen={setShowSignIn} />
      )}
    </>
  );
};

export default Sidebar;
