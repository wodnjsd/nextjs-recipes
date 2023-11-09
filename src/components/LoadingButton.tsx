import { Loader2 } from "lucide-react";
import { Button, ButtonProps } from "./ui/button";

//* Extending with props from button shadcn component to add loading state
type Props = {
  loading: boolean;
} & ButtonProps;

const LoadingButton = ({ children, loading, ...props }: Props) => {
  return (
    <Button {...props} disabled={props.disabled || loading}>
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
};

export default LoadingButton;
