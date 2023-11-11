
import prisma from "@/lib/db/prisma";
import ShowRecipe from "@/components/ShowRecipe";



const RecipePage = async ({params}: {params: {id:string}}) => {

  const recipe = await prisma.recipe.findUniqueOrThrow({
    where: {
      id: params.id},

  })
//   const wasUpdated = recipe.updatedAt > recipe.createdAt;
//   const createdUpdatedAtTimestamp = (
//     wasUpdated ? recipe.updatedAt : recipe.createdAt
//   ).toDateString();
  return (
    <>
    <ShowRecipe recipe={recipe}/>
    </>
   
  );
};

export default RecipePage;

// export async function getRecipe({params: {id}, }:{params: {id:string}}) {
// const recipe = await prisma.recipe.findUnique({
//   where: {id}
// })
//   return {
//     props: {
//       recipe
//     }
//   }
// }
 