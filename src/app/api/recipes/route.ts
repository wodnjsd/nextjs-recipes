import { recipesIndex } from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";
import { getEmbedding } from "@/lib/openai";
import {
  createRecipeSchema,
  deleteRecipeSchema,
  updateRecipeSchema,
} from "@/lib/validation/recipe";
import { auth, currentUser } from "@clerk/nextjs";
// import { revalidatePath, revalidateTag } from "next/cache";

//* CREATE
export async function POST(req: Request) {
  try {
    const body = await req.json();

    //safeParse to throw our custom error message
    const parseResult = createRecipeSchema.safeParse(body);

    //if validation fails
    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { title, ingredients, instructions, tags } = parseResult.data;

    //split strings based on spaces (`\s`), hashtags, line breaks
    //filter Boolean removes any empty elements from the arrays
    const ingredientsArray = ingredients.split(/\r?\n/).filter(Boolean);
    const tagsArray = tags.split(/[\s#\r\n]+/).filter(Boolean);

    const { userId } = auth();
    // const user = await currentUser();
    // const author = user && user.username ? user.username : user?.firstName;

    if (!userId) {
      return Response.json({ error: "Unauthorised" }, { status: 401 });
    }

    //generate embedding
    const embedding = await getEmbeddingForRecipe(
      title,
      ingredients,
      instructions,
      tags,
    );

    //* wrapping mongodb and pinecone operations in prisma transaction
    //* can do multiple database operations and will only be applied if they all succeed
    //* if error thrown inside transaction block then all operations on tx client will be rolled back
    //tx is the prisma client part of transactions
    const recipe = await prisma.$transaction(async (tx) => {
      const recipe = await tx.recipe.create({
        data: {
          title,
          ingredients: { set: ingredientsArray },
          instructions,
          tags: { set: tagsArray },
          author: {
            connect: { externalId: userId },
          },
        },
      });
      //creating entry in Pincone
      //need to put Pinecone after mongodb as prisma is only part of mongodb operation
      // which means pinecone operation cannot be rolled back
      //if pinecone operation fails mongodb create will be undone
      await recipesIndex.upsert([
        {
          id: recipe.id,
          values: embedding,
          metadata: { userId },
        },
      ]);
      return recipe;
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
      console.error(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { id, title, ingredients, instructions, tags } = parseResult.data;

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

    const embedding = await getEmbeddingForRecipe(
      title,
      ingredients,
      instructions,
      tags,
    );

    const ingredientsArray = ingredients.split(/\r?\n/).filter(Boolean);
    const tagsArray = tags.split(/[\s#\r\n]+/).filter(Boolean);

    const updatedRecipe = await prisma.$transaction(async (tx) => {
      const updatedRecipe = await tx.recipe.update({
        where: { id },
        data: {
          title,
          ingredients: { set: ingredientsArray },
          instructions,
          tags: { set: tagsArray },
        },
      });
      await recipesIndex.upsert([
        {
          id,
          values: embedding,
          metadata: { userId },
        },
      ]);
      return updatedRecipe;
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
      console.error(parseResult.error);
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
    await prisma.$transaction(async (tx) => {
      await tx.recipe.delete({ where: { id } });
      await recipesIndex.deleteOne(id);
    });
    // revalidatePath("/recipes", 'page');

    return Response.json({ message: "Recipe deleted" }, { status: 200 });
  } catch (err) {
    console.log(err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function getEmbeddingForRecipe(
  title: string,
  ingredients: string,
  instructions: string,
  tags: string,
  // comments: string[],
  // likes: number
) {
  //from openai file
  return getEmbedding(
    title + "\n\n" + ingredients + "\n\n" + instructions + "\n\n" + tags,
  );
}
