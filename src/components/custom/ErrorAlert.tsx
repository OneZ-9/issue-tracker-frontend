import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";
import { cn } from "@/lib/utils";

function ErrorAlert({
  errorMessage,
  className,
}: {
  errorMessage: string;
  className?: string;
}) {
  return (
    <Alert
      variant="destructive"
      className={cn("border-red-500 bg-red-50", className)}
    >
      <AlertCircleIcon />
      <AlertDescription>{errorMessage}</AlertDescription>
    </Alert>
  );
}

export default ErrorAlert;
