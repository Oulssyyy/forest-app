import Forest from '../../../domain/models/Forest';

export interface ForestRepositoryPort {
  findAll(): Forest[];
  findById(id: string): Forest | undefined;
  insert(forest: Forest): Forest;
  update(forest: Forest): Forest;
  delete(id: string): boolean;
  findForestByTreeId(treeId: string): Forest | undefined;
}
