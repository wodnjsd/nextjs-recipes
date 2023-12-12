import { auth } from "@clerk/nextjs";
import prisma from "@/lib/db/prisma";
import RecipeCard from "@/components/RecipeCard";
import Link from "next/link";
import { Star } from "lucide-react";

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

  const myFavourites = await prisma.recipe.findMany({
    where: {
      likes: {
        some: { userId: userId },
      },
    },
    include: {
      author: true,
      comments: true,
      likes: true,
    },
  });

  return (
    <>
      <h2 className="text-2xl py-10 flex gap-3">Your Favourites <Star size={28} fill="yellow"/></h2>
      <div className="flex w-full flex-col gap-8 ">
        {/* <div className="self-end">
        <SearchBar />
      </div> */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {myFavourites.map((recipe) => (
            <Link key={recipe.id} href={`/recipes/${recipe.id}`} passHref>
              <RecipeCard
                recipe={recipe}
                likes={recipe.likes}
                author={recipe.author}
              />
            </Link>
          ))}
          {myFavourites.length === 0 && (
            <div className="col-span-full text-center">
              You haven`&apos;`t liked any recipes yet! 
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default page;
