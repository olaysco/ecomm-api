import { PORT, DB_URI } from "./config";
import Database from "./services/Database";
import HTTPServer from "./server/HTTPServer";

(async () => {
  await Database.connect(DB_URI);
  HTTPServer.start(PORT);
})();
