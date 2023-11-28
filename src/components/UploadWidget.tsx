// import { useState, useRef } from "react";
// import { Label } from "./ui/label";
// import { Input } from "./ui/input";
// import { Button } from "./ui/button";

// const ImageUPload = ({ register }) => {
//   const inputRef = useRef();
//   const [preview, setPreview] = useState("");

//   const { ref: registerRef, ...rest } = register("image");

//   const handleUpload = (e) => {
//     const file = e.target.files[0];
//     const urlImage = URL.createObjectURL(file);
//     setPreview(urlImage);
//   };

//   const onUpload = () => {
//     inputRef.current.click();
//   };

//   const uploadButtonLabel = preview? "Change image" : "Upload image"

//   return (
//     <>
//       <Label>Image</Label>
//       <Input
//         type="file"
//         name="image"
//         {...rest}
//         onChange={handleUpload}
//         ref={(e) => {
//           registerRef(e);
//           inputRef.current = e;
//         }}
//       />
//       <Button onClick={onUpload}>{uploadButtonLabel}</Button>
//     </>
//   );
// };

// export default ImageUPload;
