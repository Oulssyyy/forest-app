import Forest, { ForestWithTrees } from "../../../domain/models/Forest";
import { Tree } from "../../../domain/models/Tree";
import { Species } from "../../../domain/models/Species";

export interface ForestServicePort {
  get(id: string): Forest;
  getWithTrees(id: string): ForestWithTrees;
  list(): ForestWithTrees[];
  save(forest: Forest): Forest;
  update(id: string, forest: Forest): Forest;
  delete(id: string): boolean;
  addTreeToForest(forestId: string, treeId: string): void;
  getTrees(forestId: string): Tree[];
  getSpecies(forestId: string): Species[];
}
