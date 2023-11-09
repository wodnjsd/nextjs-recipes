import { auth } from "@clerk/nextjs";
import { Metadata } from "next";
import prisma from "@/lib/db/prisma";
import Recipe from "@/components/Recipe";

export const metadata: Metadata = {
  title: "KimchiQueen - Recipes",
};

export default async function RecipesPage() {
  const { userId } = auth();
  if (!userId) throw Error("userId undefined");

  const allRecipes = await prisma.recipe.findMany({ where: { userId } });

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {allRecipes.map((recipe) => (
        <Recipe recipe={recipe} key={recipe.id} />
      ))}
      {allRecipes.length === 0 && (
        <div className="col-span-full text-center">
            No recipes yet, get adding!
        </div>
      )}
    </div>
  );
}
