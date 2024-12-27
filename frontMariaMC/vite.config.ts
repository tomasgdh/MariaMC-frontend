import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { ConfigEnv, defineConfig } from 'vite'
//import vue from '@vitejs/plugin-vue'
import dotenv from 'dotenv';
// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv) => {

  let env: any//DotenvConfigOutput
  // Cargar el archivo .env local en desarrollo y el archivo .env en producción
  if (process.env.NODE_ENV === 'development') {
    env = dotenv.configDotenv({ path: '.env.local' }).parsed;
  } else if (process.env.NODE_ENV === 'production') {
    env = dotenv.configDotenv({ path: '.env' }).parsed;
  } else if (process.env.NODE_ENV === 'staging') {//HOMO
    env = dotenv.configDotenv({ path: '.env.staging' }).parsed;
  }


  return defineConfig({
    plugins: [
      vue(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    base: env.VITE_APP_BASE_URL
  });
}