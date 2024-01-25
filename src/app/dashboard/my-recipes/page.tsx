import { auth } from "@clerk/nextjs";
import prisma from "@/lib/db/prisma";
import RecipeCard from "@/components/RecipeCard";
import Link from "next/link";

const page = async () => {
  const { userId } = auth();
  if (!userId) return null;
  // const user = await prisma.user.findUniqueOrThrow({
  //   where: { externalId: userId },
  //   include: {
  //     recipes: true,
  //     comments: true,
  //     likes: true,
  //   },
  // });

  const myRecipes = await prisma.recipe.findMany({
    where: { userId },
    include: {
      author: true,
      comments: true,
      likes: true,
    },
  });

  return (
    <>
      <h2 className="text-2xl py-10 ">Your Recipes</h2>
      <div className="flex w-full flex-col gap-8 ">
  
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {myRecipes.map((recipe) => (
            <Link key={recipe.id} href={`/recipes/${recipe.id}`} passHref>
              <RecipeCard
                recipe={recipe}
                likes={recipe.likes}
                author={recipe.author}
              />
            </Link>
          ))}
          {myRecipes.length === 0 && (
            <div className="col-span-full text-center">
              {`You haven't added any recipes yet!`}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default page;
