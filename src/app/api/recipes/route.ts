import prisma from "@/lib/db/prisma";
import {
  createRecipeSchema,
  deleteRecipeSchema,
  updateRecipeSchema,
} from "@/lib/validation/recipe";
import { auth } from "@clerk/nextjs";
// import { revalidatePath, revalidateTag } from "next/cache";

//* CREATE
export async function POST(req: Request) {
  try {
    const body = await req.json();

    //safeParse to throw our custom error message
    const parseResult = createRecipeSchema.safeParse(body);

    //if validation fails
    if (!parseResult.success) {
      // console.error(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { title, ingredients, instructions, tags, image } = parseResult.data;

    //split strings based on spaces (`\s`), hashtags, line breaks
    //filter Boolean removes any empty elements from the arrays
    const ingredientsArray = ingredients.split(/\r?\n/).filter(Boolean);
    const tagsArray = tags.split(/[\s#\r\n]+/).filter(Boolean);
    const instructionsArray = instructions.split(/\r?\n/).filter(Boolean);
    const { userId } = auth();
    // const user = await currentUser();
    // const author = user && user.username ? user.username : user?.firstName;

    if (!userId) {
      return Response.json({ error: "Unauthorised" }, { status: 401 });
    }

    const recipe = await prisma.recipe.create({
      data: {
        title,
        ingredients: { set: ingredientsArray },
        instructions: {set: instructionsArray },
        tags: { set: tagsArray },
        image,
        author: {
          connect: { externalId: userId },
        },
      },
    });

    //success response
    return Response.json({ recipe }, { status: 201 });
  } catch (err) {
    console.log(err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

//* UPDATE RECIPE
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const parseResult = updateRecipeSchema.safeParse(body);

    if (!parseResult.success) {
      // console.error(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { id, title, ingredients, instructions, tags, image } =
      parseResult.data;

    //check recipe exists with the id
    const recipe = await prisma.recipe.findUnique({ where: { id } });
    if (!recipe) {
      return Response.json({ error: "Recipe not found" }, { status: 404 });
    }

    const { userId } = auth();
    //only user who created recipe can edit it
    if (!userId || userId !== recipe.userId) {
      return Response.json({ error: "Unauthorised" }, { status: 401 });
    }

    const ingredientsArray = ingredients.split(/\r?\n/).filter(Boolean);
    const tagsArray = tags.split(/[\s#\r\n]+/).filter(Boolean);
    const instructionsArray = instructions.split(/\r?\n/).filter(Boolean);

    const updatedRecipe = await prisma.recipe.update({
      where: { id },
      data: {
        title,
        ingredients: { set: ingredientsArray },
        instructions: { set: instructionsArray },
        tags: { set: tagsArray },
        image,
      },
    });

    return Response.json({ updatedRecipe }, { status: 200 });
  } catch (err) {
     console.log(err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

//* DELETE
export async function DELETE(req: Request) {
  // revalidatePath('/recipes', 'page')

  try {
    const body = await req.json();
    const parseResult = deleteRecipeSchema.safeParse(body);

    if (!parseResult.success) {
      // console.error(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { id } = parseResult.data;

    const recipe = await prisma.recipe.findUnique({ where: { id } });
    if (!recipe) {
      return Response.json({ error: "Recipe not found" }, { status: 404 });
    }

    const { userId } = auth();

    if (!userId || userId !== recipe.userId) {
      return Response.json({ error: "Unauthorised" }, { status: 401 });
    }

    await prisma.recipe.delete( {where: { id } })
    // revalidatePath("/recipes", 'page');

    return Response.json({ message: "Recipe deleted" }, { status: 200 });
  } catch (err) {
     console.log(err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
