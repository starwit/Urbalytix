import {defineConfig, loadEnv} from "vite";
import react from "@vitejs/plugin-react";


export default defineConfig(({command, mode}) => {
  const env = loadEnv(mode, process.cwd(), "");

  if (command === "serve") {
    return {
      plugins: [
        react(),
        env.MOCK_AUTH === "true" && {
          name: "noauth-mock",
          configureServer(server) {
            server.middlewares.use("/urbalytix/api/user/current", (req, res, next) => {
              if (req.method === "GET") {
                res.setHeader("Content-Type", "application/json")
                res.end(JSON.stringify({ authenticated: true, roles: env.MOCK_AUTH_ROLES?.split(",") || ["admin"] }))
              } else {
                next() // pass other methods through
              }
            })
          },
        },
      ],
      base: "/urbalytix/",
      server: {
        watch: {
          usePolling: true
        },
        proxy: {
          "/urbalytix/api": "http://localhost:8081"
        }
      },
    };
  } else {
    return {
      plugins: [react()],
      base: "./"
    };
  }
});
