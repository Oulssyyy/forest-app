import { CO2AbsorptionServicePort } from '../../application/ports/inbound/CO2AbsorptionServicePort';
import Forest from '../models/Forest';
import { Tree } from '../models/Tree';
import { Species } from '../models/Species';

const DIVERSITY_FACTOR = 0.05;
const AVG_CAR_EMISSION = 2000;

export class CO2AbsorptionService implements CO2AbsorptionServicePort {
  getAbsorption(forest: Forest, trees: Tree[]): number {
    if (!trees || trees.length === 0) {
      return 0;
    }

    let totalBaseAbsorption = 0;
    const speciesSet = new Set<Species>();

    for (const tree of trees) {
      totalBaseAbsorption += tree.carbonStorageCapacity;
      speciesSet.add(tree.species);
    }

    // Diversity ratio: 1 + (Count of unique species * DIVERSITY_FACTOR)
    const diversityMultiplier = 1 + speciesSet.size * DIVERSITY_FACTOR;

    return totalBaseAbsorption * diversityMultiplier;
  }

  calculateSurfaceNeeded(forest: Forest, trees: Tree[], targetCo2: number): number {
    const currentAbsorption = this.getAbsorption(forest, trees);
    if (currentAbsorption <= 0 || forest.surface <= 0) {
      throw new Error('Cannot calculate needed surface based on an empty or zero-surface forest');
    }

    const absorptionPerUnitSurface = currentAbsorption / forest.surface;
    return targetCo2 / absorptionPerUnitSurface;
  }

  getEquivalentInCars(forest: Forest, trees: Tree[]): number {
    const absorption = this.getAbsorption(forest, trees);
    return absorption / AVG_CAR_EMISSION;
  }
}
