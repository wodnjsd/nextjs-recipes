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
import { useState } from "react";
import {
  CldUploadButton,
} from "next-cloudinary";

import Image from "next/image";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  recipeToEdit?: Recipe;
}

const presetImages = [
  "https://res.cloudinary.com/djuip85dc/image/upload/v1701219039/turkey-1460853_1280_tf3jz0.png",
  "https://res.cloudinary.com/djuip85dc/image/upload/v1701219038/spaghetti-7433732_1280_hoycqw.jpg",
  "https://res.cloudinary.com/djuip85dc/image/upload/v1701219047/eggplant-2924511_1280_orufwf.png",
];

const AddEditDialog = ({ open, setOpen, recipeToEdit }: Props) => {
  const router = useRouter();
  const { toast } = useToast();
  const [imgUrl, setImgUrl] = useState("");
  const [preview, setPreview] = useState("");

  const form = useForm<CreateRecipeSchema>({
    resolver: zodResolver(createRecipeSchema),
    // adding default values so they are not undefined, and correct error messages will appear
    defaultValues: {
      title: recipeToEdit?.title || "",
      ingredients: recipeToEdit?.ingredients.join(" ") || "",
      instructions: recipeToEdit?.instructions || "",
      tags: recipeToEdit?.tags.join(" ") || "#yummy",
      image: recipeToEdit?.image || "",
    },
  });

  //*CREATE and UPDATE
  const onSubmit = async (input: CreateRecipeSchema) => {
    // console.log(input);

    try {
      // Update
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
        // Create
        const response = await fetch("/api/recipes", {
          // next: { tags: ["recipes"] },
          method: "POST",
          body: JSON.stringify(input),
        });
        if (!response.ok) throw Error("Status code: " + response.status);
        //reset input fields if successful
        form.reset();
        setPreview("");
        setImgUrl("")
        toast({ description: "Recipe created!" });
      }
      //refresh server component
      router.push('/recipes');
      //close dialog
      setOpen(false);
    } catch (err) {
      // console.log(err);
      //!add toastify later
      alert("something went wrong");
    }
  };

  return (
    //Using Shadcn form components which uses react-hook-form under the hood
    // Make sure to import from the /ui folder which are the shadcn components not radix
    <div className="relative">
      <Dialog open={open} onOpenChange={setOpen}>
        <section className="my-4 py-4 ">
        <DialogContent className="h-5/6">
          <DialogHeader>
            <DialogTitle>
              {recipeToEdit ? "Edit Recipe" : "Add Recipe"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              {/* Recipe title */}
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
              {/* Recipe ingredients */}
              <FormField
                control={form.control}
                name="ingredients"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipe ingredients</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Recipe ingredients" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Recipe instructions */}
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
              {/* Recipe tags */}
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Tags" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className=" active:pointer-events-auto flex flex-col">
                <FormLabel>Image</FormLabel>
                {preview && <Image src={preview} alt="preview image" className=" my-2 border rounded-sm" width={60} height={60}/>}

                  <CldUploadButton
                    className="pointer-events-auto my-2 rounded-md border p-2 w-20 hover:bg-muted"
                    uploadPreset="recipes"
                    onUpload={(result, widget) => {
                      if (
                        result &&
                        result.event === "success" &&
                        typeof result.info === "object" &&
                        "secure_url" in result.info &&
                        "thumbnail_url" in result.info
                      ) {
                        const imageUrl = result.info.secure_url as string;
                        const preview = result.info.thumbnail_url as string;
                        // console.log(result.info);
                        setImgUrl(imageUrl);
                        setPreview(preview);
                        form.setValue("image", imageUrl);
                        // console.log(preview);
                        // console.log("ImgUrl", imageUrl);
                        // widget.close();
                        // handleImage()
                      }
                    }}
                    options={{
                      sources: ["local", "url", "unsplash", "camera"],
                    }}
                  >
                    <p className="text-sm">Upload</p>
                   {/* {imgUrl && preview ? <p className="text-sm">Upload</p> : <p className="text-sm">Change</p>}  */}
                  </CldUploadButton>
              </div>
              <div>
                <FormLabel>Or choose an image:</FormLabel>
                <div className="flex gap-5 ">
                  {presetImages.map((img) => (
                    <Image
                      key={img}
                      src={img}
                      alt="image"
                      onClick={() => {form.setValue("image", img); setPreview(img)}}
                      width={80} height={60}
                      className="cursor-pointer hover:scale-105"
                    />
                  ))}
                </div>
              </div>
              {/* Submit button */}
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
        </section>
       
      </Dialog>
    </div>
  );
};

export default AddEditDialog;
