"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeController = void 0;
class TreeController {
    constructor(treeService) {
        this.treeService = treeService;
    }
    registerRoutes(app) {
        app.get('/tree', this.listAllTrees.bind(this));
        app.get('/tree/:uuid', this.getTreeById.bind(this));
    }
    listAllTrees(req, res) {
        const trees = this.treeService.list();
        res.status(200).send(trees);
    }
    getTreeById(req, res) {
        const uuid = req.params.uuid;
        const tree = this.treeService.get(uuid);
        if (tree) {
            res.status(200).send(tree);
        }
        else {
            res.status(404).send({ message: "Tree not found" });
        }
    }
}
exports.TreeController = TreeController;
