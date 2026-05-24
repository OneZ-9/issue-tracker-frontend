import PageHeading from "@/components/custom/PageHeading";
import Spaces from "@/features/space/Spaces";

function SpacesPage() {
  return (
    <div>
      <PageHeading
        title="Your Spaces"
        description="Manage your spaces and access their boards and backlogs."
        className="mb-8 text-center"
      />

      <Spaces />
    </div>
  );
}

export default SpacesPage;
