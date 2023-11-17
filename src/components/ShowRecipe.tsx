"use client";
import { Recipe, Comment, Like } from "@prisma/client";
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
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import Comments from "./Comments";
import AddEditDialog from "./AddEditDialog";
import DeleteConfirm from "./DeleteConfirm";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { useToast } from "./ui/use-toast";
import { Heart } from "lucide-react";
import SignInReminder from "./SignInReminder";
// import { revalidateTag } from "next/cache";

type Props = {
  recipe: Recipe;
  comments: Comment[];
  likes: Like[];
};

const ShowRecipe = ({ recipe, comments, likes }: Props) => {
  //!this is wrong - will show the current user not the creator?
  const { userId } = useAuth();
  const [comment, setComment] = useState("");
  const [showAddEditDialog, setShowAddEditDialog] = useState(false);
  const [showSignInDialog, setShowSignInDialog] = useState(false);
  const userLiked = likes.find((like) => like.userId === userId);
  const router = useRouter();
  const { toast } = useToast();
  const wasUpdated = recipe.updatedAt > recipe.createdAt;
  const createdUpdatedAtTimestamp = (
    wasUpdated ? recipe.updatedAt : recipe.createdAt
  ).toDateString();
  const splitIngredients = recipe.ingredients
    .split("\n")
    .filter((ingredient) => ingredient.trim() !== "");
  const splitInstructions = recipe.instructions
    .split("\n")
    .filter((instruction) => instruction.trim() !== "");
  const splitTags = recipe.tags.split(/\s+/).filter((tag) => tag.trim() !== "");

  //* Adding comments
  const onSubmit = async () => {
    try {
      const response = await fetch(`/api/comments/${recipe.id}`, {
        method: "POST",
        body: JSON.stringify({ content: comment }),
      });
      if (!response.ok) throw Error("Status code: " + response.status);
      //!reset textarea
      router.refresh();
      setComment("");
    } catch (err) {
      console.log(err);
      //!add toast later
      alert("something went wrong");
    }
    toast({ description: "Comment added" });
  };

  //*Adding likes
  const onLike = async () => {
    console.log("here");
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
      <Card className="mx-5 flex flex-col gap-8 px-3 py-8 sm:mx-20 md:px-24">
        <CardHeader>
          <div className="absolute self-end">
            <button type="button"  onClick={!userId ? () => setShowSignInDialog(true) : onLike}>
              <Heart
                className={`hover:scale-110 ${
                  userLiked && "fill-current text-red-400"
                }`}
              />
            </button>
          </div>
          <CardTitle className="pb-5">{recipe.title}</CardTitle>
          <CardDescription>
            {createdUpdatedAtTimestamp}
            {wasUpdated && " (updated)"}
            <br />
            Created by: {recipe.author}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-12">
          <div>
            <h2 className="text-lg">Ingredients:</h2>
            <ul>
              {splitIngredients.map((ingredient, index) => (
                <li key={index} className="list-disc">
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-lg">Instructions:</h2>
            <ul>
              {splitInstructions.map((instruction, index) => (
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
              {splitTags.map((tag, index) => (
                <span key={index} className="rounded-full border px-2 py-1">
                  {tag.startsWith("#") ? tag : `#${tag}`}
                </span>
              ))}
            </p>
          </div>
          {/* Show and add comments */}
          <div className="flex flex-col gap-2">
            <h3>Comments:</h3>
            <form>
              <Textarea
                placeholder="Add a comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={!userId ? () => setShowSignInDialog(true) : onSubmit}
                disabled={!comment}
                className="mt-2 rounded-full border bg-stone-300 px-2 py-1 text-sm hover:scale-105"
              >
                Comment
              </button>
            </form>
            <Comments comments={comments} recipeId={recipe.id} />
          </div>
        </CardContent>
        {/* //* Edit and delete only available if you're the recipe creator  */}
        {userId === recipe.userId && (
          <CardFooter className="flex gap-3">
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
              <DialogContent>
                <DeleteConfirm recipeId={recipe.id} />
              </DialogContent>
            </Dialog>
          </CardFooter>
        )}
      </Card>
      <AddEditDialog
        open={showAddEditDialog}
        setOpen={setShowAddEditDialog}
        recipeToEdit={recipe}
      />

      <SignInReminder open={showSignInDialog} setOpen={setShowSignInDialog}/>
    </>
  );
};

export default ShowRecipe;
