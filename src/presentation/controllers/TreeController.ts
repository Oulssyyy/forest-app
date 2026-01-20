import { TreeServicePort } from '../../application/ports/inbound/TreeServicePort';
import { Express, Response, Request } from 'express';
import { CreateTreeSchema, UpdateTreeSchema } from '../validation/schemas';
import { ZodError } from 'zod';

export class TreeController {
  constructor(private treeService: TreeServicePort) {}

  registerRoutes(app: Express) {
    app.get('/tree', this.listAllTrees.bind(this));
    app.post('/tree', this.createTree.bind(this));
    app.get('/tree/:id', this.getTreeById.bind(this));
    app.put('/tree/:id', this.updateTree.bind(this));
    app.delete('/tree/:id', this.deleteTree.bind(this));
  }

  listAllTrees(req: Request, res: Response) {
    const trees = this.treeService.list();
    res.status(200).send(trees);
  }

  createTree(req: Request, res: Response) {
    try {
      const validated = CreateTreeSchema.parse(req.body);
      const tree = this.treeService.save(validated);
      res.status(201).send(tree);
    } catch (e: unknown) {
      if (e instanceof ZodError) {
        res.status(400).send({ message: 'Validation error', errors: e.issues });
        return;
      }
      const message = e instanceof Error ? e.message : 'Unknown error';
      res.status(400).send({ message });
    }
  }

  getTreeById(req: Request, res: Response) {
    try {
      const id: string = req.params.id;
      const tree = this.treeService.get(id);
      res.status(200).send(tree);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      res.status(404).send({ message });
    }
  }

  updateTree(req: Request, res: Response) {
    try {
      const id: string = req.params.id;
      const validated = UpdateTreeSchema.parse(req.body);
      const tree = this.treeService.update(id, validated);
      res.status(200).send(tree);
    } catch (e: unknown) {
      if (e instanceof ZodError) {
        res.status(400).send({ message: 'Validation error', errors: e.issues });
        return;
      }
      const message = e instanceof Error ? e.message : 'Unknown error';
      if (message === 'Tree not found') {
        res.status(404).send({ message });
      } else {
        res.status(400).send({ message });
      }
    }
  }

  deleteTree(req: Request, res: Response) {
    const id: string = req.params.id;
    const result = this.treeService.delete(id);
    if (result) {
      res.status(204).send();
    } else {
      res.status(404).send({ message: 'Tree not found' });
    }
  }
}
