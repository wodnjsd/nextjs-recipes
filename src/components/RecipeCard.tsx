"use client";

import { Recipe, Like } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Heart } from "lucide-react";

interface Props {
  recipe: Recipe;
  likes: Like[];
}

const RecipeCard = ({ recipe, likes }: Props) => {
  const wasUpdated = recipe.updatedAt > recipe.createdAt;
  const createdUpdatedAtTimestamp = (
    wasUpdated ? recipe.updatedAt : recipe.createdAt
  ).toDateString();

  return (
    <>
      <Card
        className="cursor-pointer transition-shadow hover:shadow-lg"
      >
        <CardHeader>
          <CardTitle>{recipe.title}</CardTitle>
          <CardDescription>
            {createdUpdatedAtTimestamp}
            {wasUpdated && " (updated)"}
            <p>By: {recipe.author}</p>
          </CardDescription>
        </CardHeader>
        {/* //! Only show some instructions */}
        <CardContent>
          <p className="whitespace-pre-line">{recipe.instructions}</p>
        </CardContent>
        <CardFooter>
          <Heart strokeWidth="1" className="scale-75"/>
          <span className="text-xs">{likes.length}</span>
        </CardFooter>
      </Card>
    </>
  );
};

export default RecipeCard;
