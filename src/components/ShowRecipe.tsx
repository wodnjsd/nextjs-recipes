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
import { Herr_Von_Muellerhoff } from "next/font/google";
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
  const [showDialog, setShowDialog] = useState(false);
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
    console.log('here')
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
      <Card className="mx-20 flex flex-col gap-8 px-20 py-8">
        <CardHeader>
          <div className="fixed self-end">
            <button type="button" onClick={onLike}>
              <Heart className="hover:scale-125" />
            </button>
            <span className="text-xs">{likes.length}</span>
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
                <li key={index} className="list-disc">
                  {instruction}
                </li>
              ))}
            </ul>
          </div>
          <div className="text-sm">
            <h2>Tags:</h2>
            <p>
              {splitTags.map((tag, index) => (
                <span key={index} className="rounded-full border p-2">
                  {tag.startsWith("#") ? tag : `#${tag}`}
                </span>
              ))}
            </p>
          </div>
          <div>
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
                onClick={onSubmit}
                disabled={!comment}
                className="rounded-lg border p-1 text-sm"
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
            <Button variant="outline" onClick={() => setShowDialog(true)}>
              Edit
            </Button>
            {/* <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete recipe</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <DeleteConfirm recipeId={recipe.id}/>
              </AlertDialogContent>
            </AlertDialog> */}
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
        open={showDialog}
        setOpen={setShowDialog}
        recipeToEdit={recipe}
      />
    </>
  );
};

export default ShowRecipe;
