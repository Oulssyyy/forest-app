import express from 'express';
import path from 'path';
import * as fs from "node:fs";
import * as YAML from 'yaml';
import swaggerUi from 'swagger-ui-express';

import { TreeRepositoryAdapter } from "../infrastructure/adapters/treeRepositoryAdapter";
import { TreeService } from "../domain/services/TreeService";
import { TreeController } from "../presentation/controllers/TreeController";
import { ForestRepositoryAdapter } from "../infrastructure/adapters/forestRepositoryAdapter";
import { ForestService } from "../domain/services/ForestService";
import { ForestController } from "../presentation/controllers/ForestController";
import { CO2AbsorptionService } from "../domain/services/CO2AbsorptionService";
import { errorHandler } from "./errorHandling";

const app = express();
app.use(express.json());


const file  = fs.readFileSync(require.resolve('../api/forest.yml'), 'utf8')
const swaggerDocument = YAML.parse(file)

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const treeRepo = new TreeRepositoryAdapter();
const treeService = new TreeService(treeRepo);
const treeController = new TreeController(treeService);
treeController.registerRoutes(app);

const forestRepo = new ForestRepositoryAdapter();
const forestService = new ForestService(forestRepo, treeRepo);
const co2Service = new CO2AbsorptionService();
const forestController = new ForestController(forestService, co2Service);
forestController.registerRoutes(app);

app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
  console.log(`Swagger docs at http://localhost:${port}/docs`);
});
