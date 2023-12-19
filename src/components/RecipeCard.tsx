"use client";

import { Recipe, Like, User } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Heart } from "lucide-react";
import Image from "next/image";

interface Props {
  recipe: Recipe;
  likes: Like[];
  author: User;
}

const RecipeCard = ({ recipe, likes, author }: Props) => {
  const wasUpdated = recipe.updatedAt > recipe.createdAt;
  const createdUpdatedAtTimestamp = (
    wasUpdated ? recipe.updatedAt : recipe.createdAt
  ).toDateString();

  return (
    <>
      <Card className="group flex justify-center items-center relative h-60 cursor-pointer overflow-hidden transition-shadow hover:shadow-lg">
        {recipe.image ? (
          <Image
            src={recipe.image!}
            alt={recipe.title}
            className="absolute object-cover brightness-50 group-hover:scale-105"
            fill={true}
          />) : (<div className="absolute w-full h-full object-cover bg-stone-400 dark:bg-zinc-600"></div>
        )}
        <CardContent className="flex flex-col gap-2 justify-center z-10 group-hover:scale-105">
          <CardTitle  className=" text-slate-50">{recipe.title}</CardTitle>
          <CardDescription className="text-slate-200 flex flex-col">
            {createdUpdatedAtTimestamp}
            {wasUpdated && " (updated)"}
            <span>By: {author.username}</span>
          </CardDescription>
          <div>{recipe.tags.map((tag) => <span key={tag} className="text-xs px-1 text-slate-300">#{tag}</span>)}</div>
        </CardContent>
        <CardFooter className="group-hover:scale-105 text-slate-100 z-10">
          <Heart strokeWidth="1" className="scale-75" />
          <span className="text-xs">{likes.length}</span>
        </CardFooter>
      </Card>
    </>
  );
};

export default RecipeCard;
