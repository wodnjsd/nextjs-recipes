"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

const SearchBar = () => {

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
        className="w-60 sm:w-80 translate-x-6"
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get("query")?.toString()}
      />
      {/* <button type="submit" onClick={() => handleSearch}> */}
        <Search className="-translate-x-3 translate-y-2 scale-75 text-slate-500" />
      {/* </button> */}
    </div>
  );
};

export default SearchBar;
