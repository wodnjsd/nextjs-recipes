import { Metadata } from "next";
import prisma from "@/lib/db/prisma";
import RecipeCard from "@/components/RecipeCard";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import { Filter } from "lucide-react";

export const metadata: Metadata = {
  title: "Spicify - Recipes",
};

export default async function RecipesPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    // page?: string;
  };
}) {
  const query = searchParams?.query;

  let allRecipes;
  //Searching by tags
  if (!query) {
    allRecipes = await prisma.recipe.findMany({
      include: {
        likes: true,
        author: true,
      },
    });
  } else {
    allRecipes = await prisma.recipe.findMany({
      where: {
        OR: [
          {
            tags: {
              has: `${query}`,
            },
          },
          { title: {
            contains: query
          }}
        ]
    
      },
      include: {
        likes: true,
        author: true,
      },
    });
  }

  return (
    <div className="flex w-full flex-col gap-8 mx-4 ">
      <div className="flex justify-between">
      <Filter strokeWidth={1} size={20}/>
        <SearchBar />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {allRecipes.map((recipe) => (
          <Link key={recipe.id} href={`/recipes/${recipe.id}`} passHref>
            <RecipeCard
              recipe={recipe}
              likes={recipe.likes}
              author={recipe.author}
            />
          </Link>
        ))}
        {allRecipes.length === 0 && ( query ? (
          <div className="col-span-full text-center">None found!</div>
        ) : (
          <div className="col-span-full text-center">
            No recipes yet, please add some recipes!
          </div>
        ))}
      </div>
    </div>
  );
}
