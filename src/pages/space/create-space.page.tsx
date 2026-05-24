import PageHeading from "@/components/custom/PageHeading";
import SpaceForm from "@/features/space/SpaceForm";

function CreateSpacePage() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <PageHeading
        title="Create Space"
        description="Fill out the form below to create a new space."
        className="mb-8 text-center"
      />
      <SpaceForm />
    </div>
  );
}

export default CreateSpacePage;
