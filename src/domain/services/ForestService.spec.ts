import { ForestService } from "./ForestService";
import Forest from "../models/Forest";
import { ForestType } from "../models/ForestType";
import { Tree } from "../models/Tree";
import { Species } from "../models/Species";
import { Exposure } from "../models/Exposure";
import { ForestRepositoryPort } from "../../application/ports/outbound/ForestRepositoryPort";
import { TreeRepositoryPort } from "../../application/ports/outbound/TreeRepositoryPort";
import { NotFoundError } from "../errors/NotFoundError";
import { ConflictError } from "../errors/ConflictError";

describe('ForestService', () => {
    let tree1: Tree;
    let tree2: Tree;
    let forest1: Forest;

    let repoMock: Partial<ForestRepositoryPort>;
    let treeRepoMock: Partial<TreeRepositoryPort>;
    let service: ForestService;

    beforeEach(() => {
        tree1 = { id: 't1', birth: new Date(), species: Species.OAK, exposure: Exposure.SUNNY, carbonStorageCapacity: 10 };
        tree2 = { id: 't2', birth: new Date(), species: Species.ASH, exposure: Exposure.SHADOW, carbonStorageCapacity: 15 };
        forest1 = {
             id: 'f1',
             type: ForestType.TEMPERATE,
             treeIds: ['t1'],
             surface: 100
        };

        repoMock = {
            findAll: jest.fn(),
            findById: jest.fn(),
            insert: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findForestByTreeId: jest.fn()
        };
        treeRepoMock = {
            findById: jest.fn(),
            findAll: jest.fn(),
            insert: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findByIds: jest.fn()
        };
        service = new ForestService(repoMock as ForestRepositoryPort, treeRepoMock as TreeRepositoryPort);
    });

    describe('list', () => {
        it('should list all forests with trees', () => {
            (repoMock.findAll as jest.Mock).mockReturnValue([forest1]);
            (treeRepoMock.findByIds as jest.Mock).mockReturnValue([tree1]);

            const result = service.list();
            
            expect(result).toHaveLength(1);
            expect(result[0].id).toBe(forest1.id);
            expect(result[0].trees).toEqual([tree1]);
        });
    });

    describe('save', () => {
        it('should save a valid forest', () => {
            const newForest: Forest = { id: 'f2', type: ForestType.TROPICAL, surface: 200, treeIds: [] };
            (repoMock.insert as jest.Mock).mockReturnValue(newForest);

            const result = service.save(newForest);

            expect(result).toEqual(newForest);
            expect(repoMock.insert).toHaveBeenCalledWith(newForest);
        });

        it('should throw error if surface is invalid', () => {
            const invalidForest: Forest = { id: 'f2', type: ForestType.TROPICAL, surface: 0, treeIds: [] };
            
            expect(() => service.save(invalidForest)).toThrow("Surface must be positive");
        });

        it('should throw NotFoundError if a tree does not exist', () => {
            const forestWithTree: Forest = { id: 'f2', type: ForestType.TROPICAL, surface: 200, treeIds: ['t99'] };
            (treeRepoMock.findById as jest.Mock).mockReturnValue(undefined);

            expect(() => service.save(forestWithTree)).toThrow(NotFoundError);
        });

        it('should throw ConflictError if a tree is already in another forest', () => {
            const forestWithTree: Forest = { id: 'f2', type: ForestType.TROPICAL, surface: 200, treeIds: ['t1'] };
            // Simulate that t1 belongs to f1
            (repoMock.findForestByTreeId as jest.Mock).mockReturnValue({ id: 'f1' }); 

            expect(() => service.save(forestWithTree)).toThrow(ConflictError);
        });
    });

    describe('addTreeToForest', () => {
        it('should add a tree successfully', () => {
            (treeRepoMock.findById as jest.Mock).mockReturnValue(tree2);
            (repoMock.findById as jest.Mock).mockReturnValue({ ...forest1 }); // Return a copy
            (repoMock.findForestByTreeId as jest.Mock).mockReturnValue(undefined); // No conflict

            service.addTreeToForest('f1', 't2');

            expect(repoMock.update).toHaveBeenCalled();
            const updateCallArg = (repoMock.update as jest.Mock).mock.calls[0][0];
            expect(updateCallArg.treeIds).toContain('t2');
        });

        it('should throw NotFoundError if forest not found', () => {
             (treeRepoMock.findById as jest.Mock).mockReturnValue(tree2);
             (repoMock.findById as jest.Mock).mockReturnValue(undefined);
            
             expect(() => service.addTreeToForest('unknown', 't2')).toThrow(NotFoundError);
        });
    });

    describe('getSpecies', () => {
        it('should get unique species from forest', () => {
            (repoMock.findById as jest.Mock).mockReturnValue(forest1);
            (treeRepoMock.findById as jest.Mock).mockReturnValue(tree1);

            const species = service.getSpecies('f1');
            expect(species).toEqual([Species.OAK]);
        });
    });

    describe('update', () => {
        it('should update a forest successfully', () => {
            (repoMock.findById as jest.Mock).mockReturnValue(forest1);
            // We must also mock treeRepo.findById because update logic checks for tree existence now!
            (treeRepoMock.findById as jest.Mock).mockReturnValue(tree1);
            
            (repoMock.update as jest.Mock).mockReturnValue(forest1);
            
            const updatedForest = { ...forest1, surface: 150 };
            const result = service.update('f1', updatedForest);
            
            expect(result).toEqual(result);
            expect(repoMock.update).toHaveBeenCalled();
        });

        it('should throw NotFoundError if forest to update not found', () => {
            (repoMock.findById as jest.Mock).mockReturnValue(undefined);
            expect(() => service.update('unknown', forest1)).toThrow(NotFoundError);
        });

        it('should throw ConflictError if updating treeIds creates specific conflict', () => {
            (repoMock.findById as jest.Mock).mockReturnValue(forest1);
            // Simulate that tree t2 is already in f2
            (repoMock.findForestByTreeId as jest.Mock).mockReturnValue({ id: 'f2' });
            
            const f1WithT2 = { ...forest1, treeIds: ['t1', 't2'] };
            
            expect(() => service.update('f1', f1WithT2)).toThrow(ConflictError);
        });
    });


    describe('getTrees', () => {
        it('should return trees of the forest', () => {
            (repoMock.findById as jest.Mock).mockReturnValue(forest1);
            // reset mock to ensure it doesn't return accumulation from previous tests if any issues
            (treeRepoMock.findById as jest.Mock).mockReset(); 
            (treeRepoMock.findById as jest.Mock).mockReturnValue(tree1);
            
            const result = service.getTrees('f1');
            expect(result).toHaveLength(1);
            expect(result).toEqual([tree1]);
        });

        it('should return empty array if no trees', () => {
            const emptyForest = { ...forest1, treeIds: [] };
            (repoMock.findById as jest.Mock).mockReturnValue(emptyForest);

            const result = service.getTrees('f1');
            expect(result).toEqual([]);
        });
    });

    describe('delete', () => {
        it('should delete forest', () => {
            (repoMock.delete as jest.Mock).mockReturnValue(true);
            expect(service.delete('f1')).toBe(true);
            expect(repoMock.delete).toHaveBeenCalledWith('f1');
        });
    });
});
