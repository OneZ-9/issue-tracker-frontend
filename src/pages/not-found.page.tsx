import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-muted-foreground text-lg">Page not found</p>
      <Button onClick={() => navigate(-1)}>Go Back</Button>
    </div>
  );
}

export default NotFoundPage;
