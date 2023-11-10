import { recipesIndex } from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";
import openai, { getEmbedding } from "@/lib/openai";
import { auth } from "@clerk/nextjs";
import { ChatCompletionMessage } from "openai/resources/index.mjs";
import {OpenAIStream, StreamingTextResponse} from 'ai'

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages: ChatCompletionMessage[] = body.messages;
    // getting the last 6 messages in the chat as sending too many messages
    // will make vector embedding inaccurate and use a lot of tokens
    const messagesTruncated = messages.slice(-6);
    // taking text of messages and joining into one big string with line break
    // and turning into vector embedding
    const embedding = await getEmbedding(
      messagesTruncated.map((message) => message.content).join("\n"),
    );

    const { userId } = auth();

    //* query to pinecone to find the recipes that have embedding close to that of our chat history
    const vectorQueryResponse = await recipesIndex.query({
      vector: embedding,
      // how many results we want to return:
      //! change later 
      topK: 1,
      // filter: {userId}
    });
    //* we get ids of the recipes from pinecone then use the results to request to mongodb
    const relevantRecipes = await prisma.recipe.findMany({
      where: {
        id: {
          in: vectorQueryResponse.matches.map((match) => match.id),
        },
      },
    });
    console.log("Relevant recipes found: ", relevantRecipes);

    const systemMessage: ChatCompletionMessage = {
      //giving instructions to chatGPT
      role: "system",
      content:
        "You are an intelligent recipe app. You answer the user's question based on their existing recipes. " +
        "The relevant recipes for this query are:\n " +
        relevantRecipes
          .map(
            (recipe) => `Title: ${recipe.title}\n\nContent:\n${recipe.content}`,
          )
          .join("\n\n"),
    };

    //* requesting to chatGPT
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        stream: true,
        messages: [systemMessage, ...messagesTruncated]
    })
    const stream = OpenAIStream(response)
    return new StreamingTextResponse(stream)

  } catch (err) {
    console.log(err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
