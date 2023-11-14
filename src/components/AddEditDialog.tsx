import {
  CreateRecipeSchema,
  createRecipeSchema,
} from "@/lib/validation/recipe";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useRouter } from "next/navigation";
import { Recipe } from "@prisma/client";
import { useToast } from "./ui/use-toast";
import LoadingButton from "./LoadingButton";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  recipeToEdit?: Recipe;
}

const AddEditDialog = ({ open, setOpen, recipeToEdit }: Props) => {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<CreateRecipeSchema>({
    resolver: zodResolver(createRecipeSchema),
    // add default values so they are not undefined, and correct error messages will appear
    defaultValues: {
      title: recipeToEdit?.title || "",
      instructions: recipeToEdit?.instructions || "",
      cuisine: [],
    },
  });

  //*CREATE and UPDATE
  const onSubmit = async (input: CreateRecipeSchema) => {
    //update
    try {
      if (recipeToEdit) {
        const response = await fetch("/api/recipes", {
          // next: { tags: ["recipes"] },
          method: "PUT",
          body: JSON.stringify({
            id: recipeToEdit.id,
            ...input,
          }),
        });
        if (!response.ok) throw Error("Status code: " + response.status);
        toast({ description: "Recipe updated" });
      } else {
        //create
        const response = await fetch("/api/recipes", {
          // next: { tags: ["recipes"] },
          method: "POST",
          body: JSON.stringify(input),
        });
        if (!response.ok) throw Error("Status code: " + response.status);
        //reset input fields if successful
        form.reset();
        toast({ description: "Recipe created!" });
      }
      //refresh server component
      router.refresh();

      //close dialog
      setOpen(false);
    } catch (err) {
      console.log(err);
      //!add toastify later
      alert("something went wrong");
    }
  };

  return (
    //Using Shadcn form components  which uses react-hook-form under the hood
    // Make sure to import from the /ui folder which are the shadcn components
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {recipeToEdit ? "Edit Recipe" : "Add Recipe"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipe title</FormLabel>
                  <FormControl>
                    <Input placeholder="Recipe title" {...field} />
                  </FormControl>
                  {/* Automatically shows error message of our createRecipeSchema */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipe instructions</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Recipe instructions" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-1">
              {/* <Button type="submit">SUbmit</Button> */}
              <LoadingButton
                type="submit"
                // loading is true until onSubmit async function returns
                loading={form.formState.isSubmitting}
              >
                Submit
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditDialog;
