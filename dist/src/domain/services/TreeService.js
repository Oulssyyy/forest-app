"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeService = void 0;
const NotFoundError_1 = require("../errors/NotFoundError");
class TreeService {
    constructor(repo) {
        this.repo = repo;
    }
    get(uuid) {
        const tree = this.repo.findAll().find((tree) => tree.id === uuid);
        if (!tree) {
            throw new NotFoundError_1.NotFoundError('Tree not found');
        }
        return tree;
    }
    list() {
        return this.repo.findAll();
    }
    save(tree) {
        if (tree.birth === null) {
            throw new Error("Tree birth date cannot be null");
        }
        // Some other validation rules could be defined here
        return this.repo.insert(tree);
    }
}
exports.TreeService = TreeService;
