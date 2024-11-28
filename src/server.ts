import {app} from "@/app"
import {config} from "@/configs/env-config"
import { connectDatabase } from "./connections/db";
import { createLogger } from './utils/loger';


const logger = createLogger();

app.get('/', (_req, res) => {
  res.send('Hello World')
})

app.listen(config.PORT, async () => {
  logger.info("Connecting to database");
  await connectDatabase();
  logger.start(`Server is running on port ${config.PORT}`)
})

