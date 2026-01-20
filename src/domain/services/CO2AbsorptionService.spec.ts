import { CO2AbsorptionService } from './CO2AbsorptionService';
import Forest from '../models/Forest';
import { ForestType } from '../models/ForestType';
import { Tree } from '../models/Tree';
import { Species } from '../models/Species';
import { Exposure } from '../models/Exposure';

describe('CO2AbsorptionService', () => {
  const service = new CO2AbsorptionService();
  const tree1: Tree = {
    id: 't1',
    birth: new Date(),
    species: Species.OAK,
    exposure: Exposure.SUNNY,
    carbonStorageCapacity: 10,
  };
  const tree2: Tree = {
    id: 't2',
    birth: new Date(),
    species: Species.ASH,
    exposure: Exposure.SUNNY,
    carbonStorageCapacity: 20,
  };
  const trees = [tree1, tree2];
  const forest: Forest = {
    id: 'f1',
    type: ForestType.TEMPERATE,
    treeIds: ['t1', 't2'],
    surface: 100,
  };

  it('should calculate absorption with diversity', () => {
    // Base absorption = 10 + 20 = 30
    // Diversity: 2 species. Multiplier = 1 + (2 * 0.05) = 1.1
    // Expected = 30 * 1.1 = 33
    const result = service.getAbsorption(forest, trees);
    expect(result).toBeCloseTo(33);
  });

  it('should calculate surface needed', () => {
    // Absorption = 33
    // Surface = 100
    // Absorption per surface = 0.33
    // Target = 66
    // Needed = 66 / 0.33 = 200
    const result = service.calculateSurfaceNeeded(forest, trees, 66);
    expect(result).toBeCloseTo(200);
  });

  it('should calculate cars equivalent', () => {
    // Absorption = 33
    // Car emission = 2000
    // Equivalent = 33 / 2000 = 0.0165
    const result = service.getEquivalentInCars(forest, trees);
    expect(result).toBeCloseTo(0.0165);
  });
});
