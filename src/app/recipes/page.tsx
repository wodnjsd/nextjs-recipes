
import { Metadata } from "next";
import prisma from "@/lib/db/prisma";
import Recipe from "@/components/RecipeCard";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Spicify - Recipes",
};

export default async function RecipesPage() {
  // const { userId } = auth();
  // if (!userId) throw Error("userId undefined");

  const allRecipes = await prisma.recipe.findMany();

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {allRecipes.map((recipe) => (
        <Link key={recipe.id} href={`/recipes/${recipe.id}`} passHref>
          <Recipe recipe={recipe} />
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
