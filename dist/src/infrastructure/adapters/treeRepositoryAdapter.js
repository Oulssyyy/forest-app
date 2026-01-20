"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeRepositoryAdapter = void 0;
const uuid_1 = require("uuid");
class TreeRepositoryAdapter {
    constructor() {
        this.trees = [];
    }
    findAll() {
        return this.trees;
    }
    insert(tree) {
        const persistedTree = {
            id: (0, uuid_1.v4)(),
            birth: tree.birth,
            species: tree.species,
            exposure: tree.exposure,
            carbonStorageCapacity: tree.carbonStorageCapacity
        };
        this.trees.push(tree);
        return tree;
    }
}
exports.TreeRepositoryAdapter = TreeRepositoryAdapter;
