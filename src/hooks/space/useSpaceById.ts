import SpaceService from "@/api/services/SpaceService";
import { useQuery } from "@tanstack/react-query";

function useSpaceById({ spaceId }: { spaceId: string }) {
  const {
    data,
    isLoading: isPending,
    error,
    isError,
  } = useQuery({
    queryKey: ["space", spaceId],
    queryFn: () => SpaceService.getSpaceById({ spaceId }),
  });

  const space = data?.data || null;
  return { space, isPending, error, isError };
}

export default useSpaceById;
