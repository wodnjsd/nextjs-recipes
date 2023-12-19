import {
  DialogClose,
} from "./ui/dialog";

interface Props {
  form: any;
  setPreview: React.Dispatch<React.SetStateAction<string>>;
}
const presetImages = [
  "https://res.cloudinary.com/djuip85dc/image/upload/v1701219039/turkey-1460853_1280_tf3jz0.png",
  "https://res.cloudinary.com/djuip85dc/image/upload/v1701219038/spaghetti-7433732_1280_hoycqw.jpg",
  "https://res.cloudinary.com/djuip85dc/image/upload/v1701219047/eggplant-2924511_1280_orufwf.png",
];

const DefaultImages = ({ form, setPreview }: Props) => {
  return (
    <>
      <div className="z-40 grid grid-cols-4 gap-5">
        {presetImages.map((img, i ) => (
          <DialogClose asChild key={i}>
            <img
              key={img}
              src={img}
              alt="default"
              onClick={() => {
                form.setValue("image", img);
                setPreview(img);
              }}
              className="w-24 cursor-pointer"
            />
          </DialogClose>
        ))}
      </div>
    </>
  );
};

export default DefaultImages;
