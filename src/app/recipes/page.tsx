import { Metadata } from "next";
import prisma from "@/lib/db/prisma";
import RecipeCard from "@/components/RecipeCard";
import Link from "next/link";
import SearchBar from "@/components/Search";
// import { Suspense } from "react";

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
      },
    });
  } else {
    allRecipes = await prisma.recipe.findMany({
      where: {
        tags: {
          has: `${query}`,
        },
      },
      include: {
        likes: true,
      },
    });
  }

  return (
    <>
      <SearchBar />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {allRecipes.map((recipe) => (
          <Link key={recipe.id} href={`/recipes/${recipe.id}`} passHref>
            <RecipeCard recipe={recipe} likes={recipe.likes} />
          </Link>
        ))}
        {allRecipes.length === 0 && (
          <div className="col-span-full text-center">
            No recipes yet, please add some recipes!
          </div>
        )}
      </div>
    </>
  );
}
