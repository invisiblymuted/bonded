import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { DashboardPreferences } from "@shared/schema";

export type WidgetType = "connections";

export interface ParsedPreferences {
  widgetOrder: WidgetType[];
  hiddenWidgets: WidgetType[];
  layoutDensity: "compact" | "spacious";
}

function parsePreferences(prefs: DashboardPreferences | undefined): ParsedPreferences {
  if (!prefs) {
    return {
      widgetOrder: ["connections"],
      hiddenWidgets: [],
      layoutDensity: "spacious",
    };
  }

  try {
    // Filter out deprecated widgets
    const order = (JSON.parse(prefs.widgetOrder) as string[]).filter(w => w === "connections") as WidgetType[];
    const hidden = (JSON.parse(prefs.hiddenWidgets) as string[]).filter(w => w === "connections") as WidgetType[];
    return {
      widgetOrder: order.length > 0 ? order : ["connections"],
      hiddenWidgets: hidden,
      layoutDensity: prefs.layoutDensity as "compact" | "spacious",
    };
  } catch {
    return {
      widgetOrder: ["connections"],
      hiddenWidgets: [],
      layoutDensity: "spacious",
    };
  }
}

export function useDashboardPreferences() {
  const query = useQuery<DashboardPreferences>({
    queryKey: ["/api/dashboard/preferences"],
  });

  const parsed = parsePreferences(query.data);

  return {
    ...query,
    preferences: parsed,
  };
}

export function useUpdateDashboardPreferences() {
  return useMutation({
    mutationFn: async (prefs: Partial<ParsedPreferences>) => {
      const payload: Record<string, string> = {};
      if (prefs.widgetOrder) {
        payload.widgetOrder = JSON.stringify(prefs.widgetOrder);
      }
      if (prefs.hiddenWidgets) {
        payload.hiddenWidgets = JSON.stringify(prefs.hiddenWidgets);
      }
      if (prefs.layoutDensity) {
        payload.layoutDensity = prefs.layoutDensity;
      }
      const res = await apiRequest("PATCH", "/api/dashboard/preferences", payload);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/preferences"] });
    },
  });
}
