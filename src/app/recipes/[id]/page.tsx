import prisma from "@/lib/db/prisma";
import ShowRecipe from "@/components/ShowRecipe";

const RecipePage = async ({ params }: { params: { id: string } }) => {
  const recipe = await prisma.recipe.findUniqueOrThrow({
    where: {
      id: params.id,
    },
    include: {
      comments: true
    }
  });
  return (
    <>
      <ShowRecipe  recipe={recipe} comments={recipe.comments} />
    </>
  );
};

export default RecipePage;
