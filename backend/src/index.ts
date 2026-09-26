import { createApp } from "./app";
import { config } from "./config/env";

const app = createApp();
const PORT = config.port;

app.listen(PORT, () => {
  console.log("==================================================");
  console.log(`🚀 Standalone Backend Server berjalan di:`);
  console.log(`   http://localhost:${PORT}`);
  console.log(`   Health Check: http://localhost:${PORT}/api/health`);
  console.log("==================================================");
});
