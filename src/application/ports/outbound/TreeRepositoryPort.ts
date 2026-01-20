import { Tree } from "../../../domain/models/Tree";

export interface TreeRepositoryPort {
  findAll(): Tree[];
  findById(id: string): Tree | undefined;
  insert(tree: Tree): Tree;
  update(tree: Tree): Tree;
  delete(id: string): boolean;
  findByIds(ids: string[]): Tree[];
}