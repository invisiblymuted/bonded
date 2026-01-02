import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { NotificationSettings } from "@shared/schema";

export type SoundType = "chime" | "bell" | "pop" | "gentle" | "none";
export type VibrationPattern = "short" | "long" | "double" | "none";

export function useNotificationSettings() {
  const { data: settings, isLoading } = useQuery<NotificationSettings>({
    queryKey: ["/api/notification-settings"],
  });

  const updateMutation = useMutation({
    mutationFn: async (updates: Partial<NotificationSettings>) => {
      const res = await apiRequest("PATCH", "/api/notification-settings", updates);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notification-settings"] });
    },
  });

  return {
    settings: settings || {
      soundEnabled: true,
      soundType: "chime" as SoundType,
      vibrationEnabled: true,
      vibrationPattern: "short" as VibrationPattern,
      messageNotifications: true,
      eventNotifications: true,
      journalNotifications: true,
      mediaNotifications: true,
    },
    isLoading,
    updateSettings: updateMutation.mutate,
    isPending: updateMutation.isPending,
  };
}
