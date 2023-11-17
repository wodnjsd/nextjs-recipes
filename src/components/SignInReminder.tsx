import Link from "next/link";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SignInReminder = ({ open, setOpen }: Props) => {

    // const close = () => {
    //     open = false 
    // }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Please sign in first!</DialogTitle>
        </DialogHeader>
        <Button>
          {" "}
          <Link href="/sign-in">Sign in </Link>
        </Button>
        <DialogClose asChild>
          <Button>Cancel</Button>
        </DialogClose>

        <DialogFooter className="whitespace-pre text-sm">
          Sign up{" "}
          <Link href="/sign-up" className="underline underline-offset-4">
            here
          </Link>{" "}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SignInReminder;
