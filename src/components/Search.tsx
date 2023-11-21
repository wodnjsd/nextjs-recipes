"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
// import { useState } from "react";
// import { Button } from "./ui/button";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

const SearchBar = () => {
//   const { userId } = useAuth();
//   const [user, setUser] = useState("");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = (query: string) => {
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set("query", query);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex">
      <Input
        type="text"
        //   value={query}
        placeholder="Search..."
        className="w-80"
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get("query")?.toString()}
      />
      <button type="submit" onClick={() => handleSearch}>
        <Search className="-translate-x-8 scale-75 text-slate-500" />
      </button>
    </div>
  );
};

export default SearchBar;
