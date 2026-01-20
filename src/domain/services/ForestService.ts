import { ForestServicePort } from '../../application/ports/inbound/ForestServicePort';
import Forest, { ForestWithTrees } from '../models/Forest';
import { ForestRepositoryPort } from '../../application/ports/outbound/ForestRepositoryPort';
import { NotFoundError } from '../errors/NotFoundError';
import { ConflictError } from '../errors/ConflictError';
import { Tree } from '../models/Tree';
import { Species } from '../models/Species';
import { TreeRepositoryPort } from '../../application/ports/outbound/TreeRepositoryPort';

export class ForestService implements ForestServicePort {
  constructor(
    private readonly repo: ForestRepositoryPort,
    private readonly treeRepo: TreeRepositoryPort,
  ) {}

  get(id: string): Forest {
    const forest = this.repo.findById(id);
    if (!forest) {
      throw new NotFoundError('Forest not found');
    }
    return forest;
  }

  getWithTrees(id: string): ForestWithTrees {
    const forest = this.get(id);
    const trees = forest.treeIds && forest.treeIds.length > 0 ? this.treeRepo.findByIds(forest.treeIds) : [];

    return {
      id: forest.id,
      type: forest.type,
      surface: forest.surface,
      trees: trees,
    };
  }

  list(): ForestWithTrees[] {
    const forests = this.repo.findAll();
    return forests.map((forest) => {
      const trees = forest.treeIds && forest.treeIds.length > 0 ? this.treeRepo.findByIds(forest.treeIds) : [];

      return {
        id: forest.id,
        type: forest.type,
        surface: forest.surface,
        trees: trees,
      };
    });
  }

  save(forest: Forest): Forest {
    if (forest.surface <= 0) {
      throw new Error('Surface must be positive');
    }
    if (forest.treeIds) {
      this.checkTreesAvailability(forest.treeIds);
      // Validation: verify that the trees exist
      forest.treeIds.forEach((treeId) => {
        const tree = this.treeRepo.findById(treeId);
        if (!tree) throw new NotFoundError(`Tree with id ${treeId} not found`);
      });
    } else {
      forest.treeIds = [];
    }
    return this.repo.insert(forest);
  }

  update(id: string, forest: Forest): Forest {
    const existing = this.repo.findById(id);
    if (!existing) {
      throw new NotFoundError('Forest not found');
    }
    if (forest.surface <= 0) {
      throw new Error('Surface must be positive');
    }
    if (forest.treeIds) {
      this.checkTreesAvailability(forest.treeIds, id);
      forest.treeIds.forEach((treeId) => {
        const tree = this.treeRepo.findById(treeId);
        if (!tree) throw new NotFoundError(`Tree with id ${treeId} not found`);
      });
    }
    forest.id = id;
    return this.repo.update(forest);
  }

  delete(id: string): boolean {
    return this.repo.delete(id);
  }

  addTreeToForest(forestId: string, treeId: string): void {
    const tree = this.treeRepo.findById(treeId);
    if (!tree) throw new NotFoundError('Tree not found');

    const forest = this.get(forestId);
    if (!forest.treeIds) forest.treeIds = [];

    if (!forest.treeIds.includes(treeId)) {
      this.checkTreesAvailability([treeId]);
      forest.treeIds.push(treeId);
      this.repo.update(forest);
    }
  }

  private checkTreesAvailability(treeIdsToCheck: string[], excludeForestId?: string): void {
    for (const treeId of treeIdsToCheck) {
      const existingForest = this.repo.findForestByTreeId(treeId);
      if (existingForest) {
        if (excludeForestId && existingForest.id === excludeForestId) {
          continue;
        }
        throw new ConflictError(`Tree ${treeId} is already assigned to forest ${existingForest.id}`);
      }
    }
  }

  getSpecies(forestId: string): Species[] {
    const forest = this.get(forestId);
    if (!forest.treeIds || forest.treeIds.length === 0) return [];

    const speciesSet = new Set<Species>();
    for (const id of forest.treeIds) {
      const tree = this.treeRepo.findById(id);
      if (tree) speciesSet.add(tree.species);
    }
    return Array.from(speciesSet);
  }

  getTrees(forestId: string): Tree[] {
    const forest = this.get(forestId);
    if (!forest.treeIds || forest.treeIds.length === 0) {
      return [];
    }
    const trees: Tree[] = [];
    for (const id of forest.treeIds) {
      const tree = this.treeRepo.findById(id);
      if (tree) {
        trees.push(tree);
      }
    }
    return trees;
  }
}
