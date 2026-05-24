import { useParams } from "react-router";
import SpaceForm from "@/features/space/SpaceForm";
import PageHeading from "@/components/custom/PageHeading";

function UpdateSpacePage() {
  const { spaceId } = useParams<{ spaceId: string }>();

  if (!spaceId) return null;

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <PageHeading
        title="Update Space"
        description="Fill out the form below to update this space."
        className="mb-8 text-center"
      />
      <SpaceForm spaceId={spaceId} />
    </div>
  );
}

export default UpdateSpacePage;
