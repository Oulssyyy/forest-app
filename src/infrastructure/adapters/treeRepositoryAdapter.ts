import { Tree } from '../../domain/models/Tree';
import { v4 as uuidv4 } from 'uuid';
import { TreeRepositoryPort } from '../../application/ports/outbound/TreeRepositoryPort';

export class TreeRepositoryAdapter implements TreeRepositoryPort {
  trees: Tree[] = [];

  findAll(): Tree[] {
    return this.trees;
  }

  findById(id: string): Tree | undefined {
    return this.trees.find((t) => t.id === id);
  }

  insert(tree: Tree): Tree {
    const persistedTree: Tree = {
      ...tree,
      id: uuidv4(),
    };
    this.trees.push(persistedTree);
    return persistedTree;
  }

  update(tree: Tree): Tree {
    const index = this.trees.findIndex((t) => t.id === tree.id);
    if (index !== -1) {
      this.trees[index] = tree;
      return tree;
    }
    throw new Error('Tree not found');
  }

  delete(id: string): boolean {
    const index = this.trees.findIndex((t) => t.id === id);
    if (index !== -1) {
      this.trees.splice(index, 1);
      return true;
    }
    return false;
  }

  findByIds(ids: string[]): Tree[] {
    return this.trees.filter((t) => t.id && ids.includes(t.id));
  }
}
