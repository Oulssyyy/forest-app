import Forest from "../../domain/models/Forest";
import { v4 as uuidv4 } from "uuid";
import { ForestRepositoryPort } from "../../application/ports/outbound/ForestRepositoryPort";

export class ForestRepositoryAdapter implements ForestRepositoryPort {
  forests: Forest[] = [];

  findAll(): Forest[] {
    return this.forests;
  }

  findById(id: string): Forest | undefined {
    return this.forests.find(f => f.id === id);
  }

  insert(forest: Forest): Forest {
    const persistedForest: Forest = {
      ...forest,
      id: uuidv4()
    };
    this.forests.push(persistedForest);
    return persistedForest;
  }

  update(forest: Forest): Forest {
    const index = this.forests.findIndex(f => f.id === forest.id);
    if (index !== -1) {
      this.forests[index] = forest;
      return forest;
    }
    throw new Error("Forest not found");
  }

  delete(id: string): boolean {
    const index = this.forests.findIndex(f => f.id === id);
    if (index !== -1) {
      this.forests.splice(index, 1);
      return true;
    }
    return false;
  }

  findForestByTreeId(treeId: string): Forest | undefined {
      return this.forests.find(f => f.treeIds && f.treeIds.includes(treeId));
  }
}
