import LoadingButton from "./LoadingButton";
import { Button } from "./ui/button";
import { DialogClose, DialogFooter, DialogTitle } from "./ui/dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "./ui/use-toast";

interface Props {
  recipeId: String;
}

const DeleteConfirm = ({ recipeId }: Props) => {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const { toast} = useToast()

  //*DELETE RECIPE
  //! add confirmation dialog later
  const deleteRecipe = async () => {
    setDeleting(true);
    // revalidateTag('recipes')
    try {
      const response = await fetch("/api/recipes", {
        // next: {tags: ['recipes']},
        method: "DELETE",
        body: JSON.stringify({
          id: recipeId,
        }),
      });
      if (!response.ok) throw Error("Status code: " + response.status);
      router.push("/recipes");
      router.refresh();
    } catch (err) {
      // console.log(err);
      //!add toastify later
      alert("something went wrong");
    } finally {
      setDeleting(false);
      toast({variant:"destructive", description:"Recipe deleted"})
    }
  };


  return (
    <>
      <DialogTitle>Are you sure you want to delete this?</DialogTitle>
      <DialogFooter >
        <DialogClose asChild>
          <Button type="button" variant="secondary" className="my-1">
            Cancel
          </Button>
        </DialogClose>
        <LoadingButton
          type="button"
          variant="destructive"
          loading={deleting}
          onClick={deleteRecipe}
          className="my-1"
        >
          Delete
        </LoadingButton>
      </DialogFooter>
    </>
  );
};

export default DeleteConfirm;
