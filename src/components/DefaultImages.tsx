import Image from "next/image";
import { DialogClose } from "./ui/dialog";
import { defaultImages } from "@/lib/presetImages";

interface Props {
  form: any;
  setPreview: React.Dispatch<React.SetStateAction<string>>;
}

const DefaultImages = ({ form, setPreview }: Props) => {
  return (
    <>
      <div className="z-40 grid grid-cols-4 gap-2 justify-items-center">
        {defaultImages.map((img, i) => (
          <DialogClose asChild key={i}>
            <Image
              key={img}
              src={img}
              alt="default"
              onClick={() => {
                form.setValue("image", img);
                setPreview(img);
              }}
              width={100}
              height={100}
              className="cursor-pointer rounded-lg p-1 hover:scale-105 hover:border"
            />
          </DialogClose>
        ))}
      </div>
    </>
  );
};

export default DefaultImages;
