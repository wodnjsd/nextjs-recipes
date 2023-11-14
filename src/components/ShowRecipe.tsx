"use client";
import { Recipe, Comment } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import LoadingButton from "./LoadingButton";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import Comments from "./Comments";
import AddEditDialog from "./AddEditDialog";
// import { revalidateTag } from "next/cache";

type Props = {
  recipe: Recipe;
  comments: Comment[];
};

const ShowRecipe = ({ recipe, comments }: Props) => {
  //!this is wrong - will show the current user not the creator?
  const { userId } = useAuth();
  const { user } = useUser();
  const [comment, setComment] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const wasUpdated = recipe.updatedAt > recipe.createdAt;
  const createdUpdatedAtTimestamp = (
    wasUpdated ? recipe.updatedAt : recipe.createdAt
  ).toDateString();

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
  };

  //*DELETE
  //! add confirmation dialog later
  const deleteRecipe = async () => {
    setDeleting(true);
    // revalidateTag('recipes')
    try {
      const response = await fetch("/api/recipes", {
        // next: {tags: ['recipes']},
        method: "DELETE",
        body: JSON.stringify({
          id: recipe.id,
        }),
      });
      if (!response.ok) throw Error("Status code: " + response.status);
      router.push('/recipes')
      router.refresh()
    } catch (err) {
      console.log(err);
      //!add toastify later
      alert("something went wrong");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Card className="flex w-2/3 flex-col gap-16 px-14 py-8">
        <CardHeader>
          <CardTitle className="pb-5">{recipe.title}</CardTitle>
          <CardDescription>
            {createdUpdatedAtTimestamp}
            {wasUpdated && " (updated)"}
            {/* fix this */}
            <p>Created by: {user?.username}</p>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-12">
          <div>
            <h2 className="text-lg">Instructions:</h2>
            <p className="whitespace-pre-line">{recipe.instructions}</p>
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
                className="border p-2"
              >
                Add Comment
              </button>
            </form>
            <Comments comments={comments} />
          </div>
        </CardContent>
        {/* //* Edit and delete only available if you're the recipe creator  */}
        {userId === recipe.userId && (
          <CardFooter className="flex gap-3">
            <Button variant="outline" onClick={() => setShowDialog(true)}>
              Edit
            </Button>
            <LoadingButton
              variant="destructive"
              loading={deleting}
              onClick={deleteRecipe}
              type="button"
            >
              Delete recipe
            </LoadingButton>
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
