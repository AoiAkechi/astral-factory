import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // GitHub Pagesはリポジトリ名のサブパス配下に配信されるため、
  // 絶対パス(/assets/...)ではなく相対パス(./assets/...)にしておく。
  base: "./",
});
