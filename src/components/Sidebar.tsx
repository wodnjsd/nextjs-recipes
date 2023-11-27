import Link from "next/link";
import { Home, Search, Heart, User, FilePlus2, FolderOpen } from "lucide-react";
import { Button } from "./ui/button";

const Sidebar = () => {
  return (
    <div className=" h-screen border-r">
      <div className="flex flex-col gap-10 px-8 pt-40 ">
        <Link href="/">
          <Home />
        </Link>
        <Link href="/">
          <Search />
        </Link>
        <Link href="/dashboard/my-favourites">
          <Heart />
        </Link>
        <Link href="/dashboard/my-recipes">
          <FolderOpen />
        </Link>
        <Link href="/">
          <FilePlus2 />
        </Link>
        <Link href="/dashboard/profile">
          <User />
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
