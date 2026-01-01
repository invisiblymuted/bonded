import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Notification, NotificationSettings } from "@shared/schema";
import { useRef, useEffect, useCallback } from "react";
import type { SoundType, VibrationPattern } from "./use-notification-settings";

const SOUND_CONFIGS: Record<SoundType, { frequency: number; type: OscillatorType; duration: number }> = {
  chime: { frequency: 880, type: "sine", duration: 0.3 },
  bell: { frequency: 660, type: "triangle", duration: 0.5 },
  pop: { frequency: 1200, type: "square", duration: 0.1 },
  gentle: { frequency: 440, type: "sine", duration: 0.4 },
  none: { frequency: 0, type: "sine", duration: 0 },
};

const VIBRATION_PATTERNS: Record<VibrationPattern, number[]> = {
  short: [100],
  long: [300],
  double: [100, 50, 100],
  none: [],
};

export function useNotifications() {
  const previousCountRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const { data: notifications = [], isLoading } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
    refetchInterval: 10000,
  });

  const { data: settings } = useQuery<NotificationSettings>({
    queryKey: ["/api/notification-settings"],
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const playNotificationSound = useCallback((soundType: SoundType = "chime") => {
    if (soundType === "none") return;
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }
      const ctx = audioContextRef.current;
      const config = SOUND_CONFIGS[soundType];
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.frequency.value = config.frequency;
      oscillator.type = config.type;
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + config.duration);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + config.duration);
    } catch {
      // Audio not supported
    }
  }, []);

  const triggerVibration = useCallback((pattern: VibrationPattern = "short") => {
    if (pattern === "none") return;
    try {
      if ("vibrate" in navigator) {
        navigator.vibrate(VIBRATION_PATTERNS[pattern]);
      }
    } catch {
      // Vibration not supported
    }
  }, []);

  useEffect(() => {
    if (previousCountRef.current !== null && unreadCount > previousCountRef.current) {
      if (settings?.soundEnabled !== false) {
        playNotificationSound((settings?.soundType as SoundType) || "chime");
      }
      if (settings?.vibrationEnabled !== false) {
        triggerVibration((settings?.vibrationPattern as VibrationPattern) || "short");
      }
    }
    previousCountRef.current = unreadCount;
  }, [unreadCount, playNotificationSound, triggerVibration, settings]);

  const markReadMutation = useMutation({
    mutationFn: async (notificationId: number) => {
      await apiRequest("PATCH", `/api/notifications/${notificationId}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("PATCH", "/api/notifications/read-all");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    },
  });

  return {
    notifications,
    unreadCount,
    isLoading,
    markRead: markReadMutation.mutate,
    markAllRead: markAllReadMutation.mutate,
  };
}
