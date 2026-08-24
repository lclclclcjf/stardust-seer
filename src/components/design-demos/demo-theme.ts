import type { UiThemeMode } from "@/types";

export type DemoThemeMode = UiThemeMode;

export function parseDemoTheme(
  value: string | string[] | undefined,
): DemoThemeMode {
  return value === "dark" || value === "light" ? value : "auto";
}
