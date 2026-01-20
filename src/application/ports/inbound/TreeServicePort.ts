import { Tree } from '../../../domain/models/Tree';

export interface TreeServicePort {
  get(uuid: string): Tree;
  list(): Tree[];
  save(tree: Tree): Tree;
  update(id: string, tree: Tree): Tree;
  delete(id: string): boolean;
}
