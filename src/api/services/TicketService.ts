import { deleteRequest, get, patch, post } from "../axiosClient";
import type {
  CreateTicketPayload,
  ExportTicketsQuery,
  ListTicketsQuery,
  UpdateTicketPayload,
  UpdateTicketStatusPayload,
} from "@/validators/ticket-validators";

class TicketService {
  static async createTicket({
    spaceId,
    reqBody,
  }: {
    spaceId: string;
    reqBody: CreateTicketPayload;
  }) {
    const response = await post({
      path: `/spaces/${spaceId}/tickets`,
      reqBody,
    });
    return response;
  }

  static async getTickets({
    spaceId,
    params,
  }: {
    spaceId: string;
    params?: ListTicketsQuery;
  }) {
    const response = await get({ path: `/spaces/${spaceId}/tickets`, params });
    return response;
  }

  static async getTicketById({
    spaceId,
    ticketId,
  }: {
    spaceId: string;
    ticketId: string;
  }) {
    const response = await get({
      path: `/spaces/${spaceId}/tickets/${ticketId}`,
    });
    return response;
  }

  static async updateTicket({
    spaceId,
    ticketId,
    reqBody,
  }: {
    spaceId: string;
    ticketId: string;
    reqBody: UpdateTicketPayload;
  }) {
    const response = await patch({
      path: `/spaces/${spaceId}/tickets/${ticketId}`,
      reqBody,
    });
    return response;
  }

  static async updateTicketStatus({
    spaceId,
    ticketId,
    reqBody,
  }: {
    spaceId: string;
    ticketId: string;
    reqBody: UpdateTicketStatusPayload;
  }) {
    const response = await patch({
      path: `/spaces/${spaceId}/tickets/${ticketId}/status`,
      reqBody,
    });
    return response;
  }

  static async deleteTicket({
    spaceId,
    ticketId,
  }: {
    spaceId: string;
    ticketId: string;
  }) {
    const response = await deleteRequest({
      path: `/spaces/${spaceId}/tickets/${ticketId}`,
    });
    return response;
  }

  static async getTicketStats({ spaceId }: { spaceId: string }) {
    const response = await get({ path: `/spaces/${spaceId}/tickets/stats` });
    return response;
  }

  static async exportTickets({
    spaceId,
    params,
  }: {
    spaceId: string;
    params?: ExportTicketsQuery;
  }) {
    const response = await get({
      path: `/spaces/${spaceId}/tickets/export`,
      params,
    });
    return response;
  }

  static async getKanbanData({ spaceId }: { spaceId: string }) {
    const response = await get({ path: `/spaces/${spaceId}/tickets/kanban` });
    return response;
  }
}

export default TicketService;
