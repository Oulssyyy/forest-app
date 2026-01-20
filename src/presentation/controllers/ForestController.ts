import { Express, Request, Response } from 'express';
import { ZodError } from 'zod';
import { ForestServicePort } from '../../application/ports/inbound/ForestServicePort';
import { CO2AbsorptionServicePort } from '../../application/ports/inbound/CO2AbsorptionServicePort';
import { CreateForestSchema, UpdateForestSchema, AddTreeToForestSchema } from '../validation/schemas';
import { ConflictError } from '../../domain/errors/ConflictError';

export class ForestController {
  constructor(
    private forestService: ForestServicePort,
    private co2Service: CO2AbsorptionServicePort,
  ) {}

  registerRoutes(app: Express) {
    app.get('/forest', this.listAll.bind(this));
    app.post('/forest', this.create.bind(this));
    app.get('/forest/:id', this.getById.bind(this));
    app.put('/forest/:id', this.update.bind(this));
    app.delete('/forest/:id', this.delete.bind(this));

    app.post('/forest/:id/trees', this.addTree.bind(this));
    app.get('/forest/:id/species', this.getSpecies.bind(this));
    app.get('/forest/:id/absorption', this.getAbsorption.bind(this));
    app.get('/forest/:id/surface-needed', this.getSurfaceNeeded.bind(this));
    app.get('/forest/:id/cars-equivalent', this.getCarsEquivalent.bind(this));
  }

  listAll(req: Request, res: Response) {
    res.status(200).send(this.forestService.list());
  }

  create(req: Request, res: Response) {
    try {
      const validated = CreateForestSchema.parse(req.body);
      const forest = this.forestService.save(validated);
      res.status(201).send(forest);
    } catch (e: unknown) {
      if (e instanceof ZodError) {
        res.status(400).send({ message: 'Validation error', errors: e.issues });
        return;
      }
      if (e instanceof ConflictError) {
        res.status(409).send({ message: e.message });
        return;
      }
      const message = e instanceof Error ? e.message : 'Unknown error';
      res.status(400).send({ message });
    }
  }

  getById(req: Request, res: Response) {
    try {
      const forest = this.forestService.getWithTrees(req.params.id);
      res.status(200).send(forest);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      res.status(404).send({ message });
    }
  }

  update(req: Request, res: Response) {
    try {
      const validated = UpdateForestSchema.parse(req.body);
      const forest = this.forestService.update(req.params.id, validated);
      res.status(200).send(forest);
    } catch (e: unknown) {
      if (e instanceof ZodError) {
        res.status(400).send({ message: 'Validation error', errors: e.issues });
        return;
      }
      if (e instanceof ConflictError) {
        res.status(409).send({ message: e.message });
        return;
      }
      const message = e instanceof Error ? e.message : 'Unknown error';
      if (message === 'Forest not found') {
        res.status(404).send({ message });
      } else {
        res.status(400).send({ message });
      }
    }
  }

  delete(req: Request, res: Response) {
    if (this.forestService.delete(req.params.id)) {
      res.status(204).send();
    } else {
      res.status(404).send({ message: 'Forest not found' });
    }
  }

  addTree(req: Request, res: Response) {
    try {
      const validated = AddTreeToForestSchema.parse(req.body);
      this.forestService.addTreeToForest(req.params.id, validated.treeId);
      res.status(200).send({ message: 'Tree added' });
    } catch (e: unknown) {
      if (e instanceof ZodError) {
        res.status(400).send({ message: 'Validation error', errors: e.issues });
        return;
      }
      if (e instanceof ConflictError) {
        res.status(409).send({ message: e.message });
        return;
      }
      const message = e instanceof Error ? e.message : 'Unknown error';
      res.status(404).send({ message });
    }
  }

  getSpecies(req: Request, res: Response) {
    try {
      const species = this.forestService.getSpecies(req.params.id);
      res.status(200).send(species);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      res.status(404).send({ message });
    }
  }

  getAbsorption(req: Request, res: Response) {
    try {
      const forest = this.forestService.get(req.params.id);
      const trees = this.forestService.getTrees(req.params.id);
      const absorption = this.co2Service.getAbsorption(forest, trees);
      res.status(200).send({ absorption });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      res.status(404).send({ message });
    }
  }

  getSurfaceNeeded(req: Request, res: Response) {
    try {
      const forest = this.forestService.get(req.params.id);
      const trees = this.forestService.getTrees(req.params.id);
      const target = parseFloat(req.query.targetCo2 as string);
      if (isNaN(target)) {
        res.status(400).send({ message: 'targetCo2 must be a number' });
        return;
      }
      const surfaceNeeded = this.co2Service.calculateSurfaceNeeded(forest, trees, target);
      res.status(200).send({ surfaceNeeded });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      res.status(400).send({ message });
    }
  }

  getCarsEquivalent(req: Request, res: Response) {
    try {
      const forest = this.forestService.get(req.params.id);
      const trees = this.forestService.getTrees(req.params.id);
      const cars = this.co2Service.getEquivalentInCars(forest, trees);
      res.status(200).send({ cars });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      res.status(404).send({ message });
    }
  }
}
