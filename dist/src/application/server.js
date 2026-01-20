"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs = __importStar(require("node:fs"));
const YAML = __importStar(require("yaml"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const treeRepositoryAdapter_1 = require("../infrastructure/adapters/treeRepositoryAdapter");
const TreeService_1 = require("../domain/services/TreeService");
const treeController_1 = require("../presentation/controllers/treeController");
const errorHandling_1 = require("./errorHandling");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const file = fs.readFileSync(require.resolve('../api/forest.yml'), 'utf8');
const swaggerDocument = YAML.parse(file);
app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
const treeRepo = new treeRepositoryAdapter_1.TreeRepositoryAdapter();
const treeService = new TreeService_1.TreeService(treeRepo);
const treeController = new treeController_1.TreeController(treeService);
treeController.registerRoutes(app);
app.use(errorHandling_1.errorHandler);
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
    console.log(`Swagger docs at http://localhost:${port}/docs`);
});
