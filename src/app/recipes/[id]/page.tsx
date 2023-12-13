import prisma from "@/lib/db/prisma";
import ShowRecipe from "@/components/ShowRecipe";
import bgLarge from "@/assets/spices.jpg";
import bgSmall from "@/assets/pineapple.jpg";
import Image from "next/image";

const RecipePage = async ({ params }: { params: { id: string } }) => {
  const recipe = await prisma.recipe.findUniqueOrThrow({
    where: {
      id: params.id,
    },
    include: {
      comments: true,
      likes: true,
      author: true,
    },
  });
  return (
    <>
      {/* <Image
        src={bgLarge}
        fill={true}
        alt="background"
        className="-z-10  hidden xl:block absolute"
      />
      <Image
        src={bgSmall}
        fill={true}
        alt="background"
        className="-z-10 hidden sm:flex xl:hidden"
      /> */}
      <ShowRecipe
        recipe={recipe}
        comments={recipe.comments}
        likes={recipe.likes}
        author={recipe.author}
    
      />
    </>
  );
};

export default RecipePage;
