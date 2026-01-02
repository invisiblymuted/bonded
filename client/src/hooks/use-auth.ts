import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "@shared/models/auth";

async function fetchUser(): Promise<User | null> {
  const response = await fetch("/api/user", {
    credentials: "include",
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  const user = await response.json();
  
  // Save to localStorage for persistence
  if (user) {
    localStorage.setItem("bonded_user", JSON.stringify(user));
    localStorage.setItem("bonded_auth_timestamp", new Date().toISOString());
  }
  
  return user;
}

async function logout(): Promise<void> {
  // Clear localStorage
  localStorage.removeItem("bonded_user");
  localStorage.removeItem("bonded_auth_timestamp");
  window.location.href = "/api/logout";
}

export function useAuth() {
  const queryClient = useQueryClient();
  
  // Try to restore from localStorage first
  const getInitialData = () => {
    try {
      const stored = localStorage.getItem("bonded_user");
      return stored ? JSON.parse(stored) : undefined;
    } catch {
      return undefined;
    }
  };
  
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["/api/user"],
    queryFn: fetchUser,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    initialData: getInitialData(),
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
}
