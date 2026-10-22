import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./" makes the build work on Vercel, GitHub Pages and any static host.
export default defineConfig({ plugins: [react()], base: "./" });
