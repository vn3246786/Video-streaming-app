import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server:{
   
proxy:{
  "/api":"https://video-streaming-app-dguh.onrender.com",
  
}
  },
  plugins: [react()],
})
