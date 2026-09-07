import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/https://github.com/BlankS0800/TUnder.git/', // <- Reemplaza con el nombre exacto de tu repo en GitHub
})
