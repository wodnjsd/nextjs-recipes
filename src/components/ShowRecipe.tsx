"use client";
import { Recipe, Comment, Like, User } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { useState } from "react";
import Comments from "./Comments";
import AddEditDialog from "./AddEditDialog";
import DeleteConfirm from "./DeleteConfirm";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { useToast } from "./ui/use-toast";
import { Heart } from "lucide-react";
import SignInReminder from "./SignInReminder";
import Image from "next/image";
import { imageData } from "@/lib/imageData";

type Props = {
  recipe: Recipe;
  comments: Comment[];
  likes: Like[];
  author: User;
};

const ShowRecipe = ({ recipe, comments, likes, author }: Props) => {
  const { userId } = useAuth();
  const [showAddEditDialog, setShowAddEditDialog] = useState(false);
  const [showSignInDialog, setShowSignInDialog] = useState(false);
  const userLiked = likes.find((like) => like.userId === userId);
  const router = useRouter();
  const { toast } = useToast();
  const wasUpdated = recipe.updatedAt > recipe.createdAt;
  const createdUpdatedAtTimestamp = (
    wasUpdated ? recipe.updatedAt : recipe.createdAt
  ).toDateString();
  const randomImage = imageData[Math.floor(Math.random() * imageData.length)];

  //* Adding likes
  const onLike = async () => {
    try {
      const response = await fetch(`/api/recipes/${recipe.id}`, {
        method: "PUT",
        body: JSON.stringify({
          id: recipe.id,
        }),
      });
      if (!response.ok) throw Error("Status code " + response.status);
      router.refresh();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Card className="font-ysabeau relative my-8 flex w-4/5 max-w-3xl flex-col gap-6 px-1 py-5 md:px-16 md:py-12  ">
        <CardHeader>
          <div className="absolute self-end">
            <button
              type="button"
              onClick={!userId ? () => setShowSignInDialog(true) : onLike}
            >
              {/* //* Heart button to like/ unlike recipe */}
              <Heart
                className={`translate-y-4 hover:scale-110 ${
                  userLiked && "fill-current text-red-400"
                }`}
              />
            </button>
          </div>
          <CardTitle className="pb-3 text-4xl">{recipe.title}</CardTitle>
          <CardDescription>
            {createdUpdatedAtTimestamp}
            {wasUpdated && " (updated)"}
            <br />
            Created by: {author.username}
            <p>{recipe.cuisine}</p>
          </CardDescription>
          {recipe.image && (
            <div className="self-center w-5/6 pt-8 lg:w-4/5 ">
              {/* <Image src={recipe.image} alt={recipe.title} fill={true} /> */}
              <img
                src={recipe.image}
                alt={recipe.title}
                className=" rounded-2xl"
              />
            </div>
          )}
        </CardHeader>
        <CardContent className="flex flex-col gap-12">
          <div>
            <h2 className="py-1 text-xl font-semibold">Ingredients:</h2>
            <ul className="translate-x-3">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="list-disc">
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="py-1 text-xl font-semibold">Instructions:</h2>
            <ul className="translate-x-4">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="list-decimal">
                  {instruction}
                </li>
              ))}
            </ul>
          </div>
          {/* Show tags */}
          <div className="text-sm">
            <h2 className="py-2">Tags:</h2>
            <p>
              {recipe.tags.map((tag, index) => (
                <span key={index} className="rounded-full border border-secondary px-2 pb-1">
                  {tag.startsWith("#") ? tag : `#${tag}`}
                </span>
              ))}
            </p>
          </div>
          {/* //* Show and add comments */}
          <Comments comments={comments} recipeId={recipe.id} author={author} />
        </CardContent>
        <CardFooter className="flex gap-3">
           {/* //* Edit and delete only available if you're the recipe creator  */}
          {userId === recipe.userId && (
            <>
              <Button
                variant="outline"
                onClick={() => setShowAddEditDialog(true)}
              >
                Edit
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive">Delete recipe</Button>
                </DialogTrigger>
                <DialogContent className="flex h-52 flex-col justify-between">
                  <DeleteConfirm recipeId={recipe.id} />
                </DialogContent>
              </Dialog>
            </>
          )}
          <Image
            src={randomImage}
            alt="small image"
            className="absolute bottom-5 right-4 w-12 md:w-20 lg:w-24"
          />
        </CardFooter>
      </Card>
      <AddEditDialog
        open={showAddEditDialog}
        setOpen={setShowAddEditDialog}
        recipeToEdit={recipe}
      />
      {showSignInDialog && (
        <SignInReminder open={showSignInDialog} setOpen={setShowSignInDialog} />
      )}
    </>
  );
};

export default ShowRecipe;
