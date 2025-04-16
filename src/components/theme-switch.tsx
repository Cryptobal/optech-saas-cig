"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: 22,
        color: "inherit",
        padding: 8,
        borderRadius: 8,
        transition: "background 0.2s"
      }}
      title={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      {theme === "dark" ? "🌙" : "☀️"}
    </button>
  );
} 