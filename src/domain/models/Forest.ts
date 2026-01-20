import { ForestType } from './ForestType';
import { Tree } from './Tree';

export default interface Forest {
  id?: string;
  type: ForestType;
  treeIds: string[];
  surface: number;
}

export interface ForestWithTrees extends Omit<Forest, 'treeIds'> {
  trees: Tree[];
}
