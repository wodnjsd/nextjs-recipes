"use client";
import { Recipe } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";


interface Props {
  recipe: Recipe;
}

const ShowRecipe = ({ recipe }: Props) => {

  const wasUpdated = recipe.updatedAt > recipe.createdAt;
  const createdUpdatedAtTimestamp = (
    wasUpdated ? recipe.updatedAt : recipe.createdAt
  ).toDateString();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{recipe.title}</CardTitle>
        <CardDescription>
          {createdUpdatedAtTimestamp}
          {wasUpdated && " (updated)"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-line">{recipe.content}</p>
        <div>
          <h3>Comments:</h3>
          {/* <div>
            {recipe.comments.map((comment) => (

            ))}
          </div> */}
        </div>
      </CardContent>
    </Card>
  );
};

export default ShowRecipe;