import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";

function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-bold">403</h1>
      <p className="text-muted-foreground text-lg">
        You are not authorized to view this page.
      </p>
      <Button onClick={() => navigate(-1)}>Go Back</Button>
    </div>
  );
}

export default UnauthorizedPage;
