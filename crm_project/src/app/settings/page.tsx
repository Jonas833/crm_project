"use client";

import { useTheme } from "@/app/theme_provider";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <h1>Einstellungen</h1>

      <h2>Theme</h2>

      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value as any)}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="colorblind">Farbenblind</option>
      </select>
    </div>
  );
}
