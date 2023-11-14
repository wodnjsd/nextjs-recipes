import { Metadata } from "next";
import prisma from "@/lib/db/prisma";
import RecipeCard from "@/components/RecipeCard";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Spicify - Recipes",
};

export default async function RecipesPage() {
  
  const allRecipes = await prisma.recipe.findMany();

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {allRecipes.map((recipe) => (
        <Link key={recipe.id} href={`/recipes/${recipe.id}`} passHref>
          <RecipeCard recipe={recipe} />
        </Link>
      ))}
      {allRecipes.length === 0 && (
        <div className="col-span-full text-center">
          No recipes yet, please add some recipes!
        </div>
      )}
    </div>
  );
}
