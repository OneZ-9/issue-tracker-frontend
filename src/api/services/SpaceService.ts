import { deleteRequest, get, patch, post } from "../axiosClient";
import type {
  CreateSpacePayload,
  UpdateSpacePayload,
} from "@/validators/space-validators";

class SpaceService {
  static async createSpace({ reqBody }: { reqBody: CreateSpacePayload }) {
    const response = await post({ path: "/spaces", reqBody });
    return response;
  }

  static async getSpaces() {
    const response = await get({ path: "/spaces" });
    return response;
  }

  static async getSpaceById({ spaceId }: { spaceId: string }) {
    const response = await get({ path: `/spaces/${spaceId}` });
    return response;
  }

  static async updateSpace({
    spaceId,
    reqBody,
  }: {
    spaceId: string;
    reqBody: UpdateSpacePayload;
  }) {
    const response = await patch({ path: `/spaces/${spaceId}`, reqBody });
    return response;
  }

  static async deleteSpace({ spaceId }: { spaceId: string }) {
    const response = await deleteRequest({ path: `/spaces/${spaceId}` });
    return response;
  }
}

export default SpaceService;
