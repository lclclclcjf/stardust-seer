export type DemoThemeMode = "auto" | "light" | "dark";

export function parseDemoTheme(
  value: string | string[] | undefined,
): DemoThemeMode {
  return value === "dark" || value === "light" ? value : "auto";
}
