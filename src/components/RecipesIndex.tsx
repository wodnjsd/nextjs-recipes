import RecipeCard from "./RecipeCard";
import Link from "next/link";
import prisma from "@/lib/db/prisma";

// interface MyRecipe extends Recipe {
//   likes: Like[];
// }
// interface Props {
//   recipes: MyRecipe[];
// }

//! Fetch filtered recipes here

interface Props {
  query: String;
}

const RecipesIndex = async ({ query }: Props) => {
  let allRecipes;
  if (query === "") {
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
  //   const allRecipes = await prisma.recipe.findMany({
  //     where: {
  //         tags: {
  //             has: `${query}`,
  //         },
  //     },
  //     include: {
  //       likes: true,
  //     },
  //   });

  return (
    <div>
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
    </div>
  );
};

export default RecipesIndex;
