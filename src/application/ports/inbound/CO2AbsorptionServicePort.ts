import Forest from "../../../domain/models/Forest";
import { Tree } from "../../../domain/models/Tree";

/**
 * TODO : You will add some methods in this interface to compute the carbon dioxide absorption.
 */
export interface CO2AbsorptionServicePort {
  getAbsorption(forest: Forest, trees: Tree[]): number;
  calculateSurfaceNeeded(forest: Forest, trees: Tree[], targetCo2: number): number;
  getEquivalentInCars(forest: Forest, trees: Tree[]): number;
}
