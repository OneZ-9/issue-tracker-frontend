// import { useParams } from "react-router";

function BoardPage() {
  //   const { spaceId, ticketId } = useParams<{
  //     spaceId: string;
  //     ticketId?: string;
  //   }>();

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">Board</h2>
      {/* {ticketId && (
        <p className="text-muted-foreground text-sm">
          Selected ticket: {ticketId}
        </p>
      )} */}
    </div>
  );
}

export default BoardPage;
