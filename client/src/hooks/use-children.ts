import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertChild, type Child } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

// Fetch all children (Public)
export function useChildren() {
  return useQuery({
    queryKey: [api.children.list.path],
    queryFn: async () => {
      const res = await fetch(api.children.list.path);
      if (!res.ok) throw new Error("Failed to fetch children");
      return api.children.list.responses[200].parse(await res.json());
    },
  });
}

// Fetch my children (Protected)
export function useMyChildren() {
  return useQuery({
    queryKey: [api.children.listMine.path],
    queryFn: async () => {
      const res = await fetch(api.children.listMine.path, { credentials: "include" });
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to fetch my children");
      return api.children.listMine.responses[200].parse(await res.json());
    },
  });
}

// Fetch single child
export function useChild(id: number) {
  return useQuery({
    queryKey: [api.children.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.children.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch child details");
      return api.children.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

// Create Child
export function useCreateChild() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: Omit<InsertChild, "parentId">) => {
      // Validate with schema on client side before sending if needed
      const res = await fetch(api.children.create.path, {
        method: api.children.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to report missing child");
      }
      return api.children.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.children.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.children.listMine.path] });
      toast({
        title: "Report Submitted",
        description: "The profile has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Update Child
export function useUpdateChild() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & Partial<Omit<InsertChild, "parentId">>) => {
      const url = buildUrl(api.children.update.path, { id });
      const res = await fetch(url, {
        method: api.children.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }
      return api.children.update.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.children.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.children.listMine.path] });
      queryClient.invalidateQueries({ queryKey: [api.children.get.path, data.id] });
      toast({
        title: "Updated",
        description: "Child profile updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Delete Child
export function useDeleteChild() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.children.delete.path, { id });
      const res = await fetch(url, { 
        method: api.children.delete.method,
        credentials: "include" 
      });

      if (!res.ok) throw new Error("Failed to delete record");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.children.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.children.listMine.path] });
      toast({
        title: "Record Removed",
        description: "The profile has been removed from the database.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
