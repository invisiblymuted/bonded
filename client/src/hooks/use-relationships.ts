import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Relationship, Message, JournalEntry, Media } from "@shared/schema";
import { api, buildUrl } from "@shared/routes";

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
    mutationFn: async (data: { title: string; content: string; mood?: string }) => {
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
