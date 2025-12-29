import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Relationship, Message, JournalEntry, Media, Event } from "@shared/schema";
import { api, buildUrl } from "@shared/routes";
import type { User } from "@shared/models/auth";

export function useRelationships() {
  return useQuery<Relationship[]>({
    queryKey: [api.relationships.list.path],
    queryFn: async () => {
      const res = await fetch(api.relationships.list.path, { credentials: "include" });
      if (!res.ok) throw new Error(`${res.status}`);
      return res.json();
    },
  });
}

export function useMessages(relationshipId: number) {
  return useQuery<Message[]>({
    queryKey: [api.messages.list.path, relationshipId],
    queryFn: async () => {
      const url = buildUrl(api.messages.list.path, { relationshipId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error(`${res.status}`);
      return res.json();
    },
  });
}

export function useJournal(relationshipId: number) {
  return useQuery<JournalEntry[]>({
    queryKey: [api.journal.list.path, relationshipId],
    queryFn: async () => {
      const url = buildUrl(api.journal.list.path, { relationshipId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error(`${res.status}`);
      return res.json();
    },
  });
}

export function useMediaGallery(relationshipId: number) {
  return useQuery<Media[]>({
    queryKey: [api.media.list.path, relationshipId],
    queryFn: async () => {
      const url = buildUrl(api.media.list.path, { relationshipId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error(`${res.status}`);
      return res.json();
    },
  });
}

export function useCreateMessage(relationshipId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (content: string) => {
      const url = buildUrl(api.messages.create.path, { relationshipId });
      const res = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.messages.list.path, relationshipId] });
    },
  });
}

export function useCreateJournalEntry(relationshipId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { title: string; content: string; mood?: string; mediaUrl?: string; mediaType?: string }) => {
      const url = buildUrl(api.journal.create.path, { relationshipId });
      const res = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.journal.list.path, relationshipId] });
    },
  });
}

export function useCreateRelationship() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { parentId: string; childId: string; childName: string }) => {
      const res = await fetch(api.relationships.create.path, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.relationships.list.path] });
    },
  });
}

export function useCreateMedia(relationshipId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { type: "photo" | "drawing" | "video" | "audio"; url: string; filename: string; caption?: string }) => {
      const url = buildUrl(api.media.create.path, { relationshipId });
      const res = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.media.list.path, relationshipId] });
    },
  });
}

export function useSearchUsers() {
  return useQuery<User[]>({
    queryKey: ["user-search"],
    queryFn: async () => [],
    enabled: false,
  });
}

export function useSendRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { childId: string; childName: string }) => {
      const res = await fetch(api.relationships.create.path, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parentId: "", childId: data.childId, childName: data.childName }),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.relationships.list.path] });
    },
  });
}

export function useAcceptRequest(relationshipId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(buildUrl(api.relationships.accept.path, { id: relationshipId }), {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error(`${res.status}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.relationships.list.path] });
    },
  });
}

export function useDeleteMedia(relationshipId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (mediaId: number) => {
      const url = buildUrl(api.media.delete.path, { relationshipId, mediaId });
      const res = await fetch(url, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error(`${res.status}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.media.list.path, relationshipId] });
    },
  });
}

export function useEvents(relationshipId: number) {
  return useQuery<Event[]>({
    queryKey: [api.events.list.path, relationshipId],
    queryFn: async () => {
      const url = buildUrl(api.events.list.path, { relationshipId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error(`${res.status}`);
      return res.json();
    },
  });
}

export function useCreateEvent(relationshipId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { title: string; description?: string; eventDate: string; eventType: string; reminder?: boolean }) => {
      const url = buildUrl(api.events.create.path, { relationshipId });
      const res = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.events.list.path, relationshipId] });
    },
  });
}

export function useDeleteEvent(relationshipId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (eventId: number) => {
      const url = buildUrl(api.events.delete.path, { eventId });
      const res = await fetch(url, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error(`${res.status}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.events.list.path, relationshipId] });
    },
  });
}
