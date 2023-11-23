import Link from "next/link";
import { Home, Search, Heart, User, FilePlus2 } from "lucide-react";
import { Button } from "./ui/button";

const Sidebar = () => {
  return (
    <section>
      <div className="flex w-full flex-1 flex-col gap-6 px-6">
        <Link href="/">
          <Home />
        </Link>
        <Link href="/">
          <Search />
        </Link>
        <Link href="/">
          <Heart />
        </Link>
        <Link href="/">
          <FilePlus2 />
        </Link>
        <Button>
          <User />
        </Button>
      </div>
    </section>
  );
};

export default Sidebar;
