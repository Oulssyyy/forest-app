import { Tree } from "../models/Tree";
import { Species } from "../models/Species";
import { Exposure } from "../models/Exposure";
import { TreeService } from "./TreeService";
import { TreeRepositoryPort } from "../../application/ports/outbound/TreeRepositoryPort";
import { NotFoundError } from "../errors/NotFoundError";

describe('TreeService', () => {
  it('should get the correct tree by UUID', () => {
    // Arrange
    const trees: Tree[] = [
      { id: '1', birth: new Date('2020-01-01'), species: Species.OAK, exposure: Exposure.SUNNY, carbonStorageCapacity: 100 },
      { id: '2', birth: new Date('2019-05-15'), species: Species.ASH, exposure: Exposure.MID_SHADOW, carbonStorageCapacity: 150 }
    ];
    const repoMock: Partial<TreeRepositoryPort> = {
      findAll: jest.fn().mockReturnValue(trees),
      findById: jest.fn().mockReturnValue(trees[1]),
      insert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    };
    const treeService = new TreeService(repoMock as TreeRepositoryPort);

    // Act
    const tree = treeService.get('2');
    
    // Assert
    expect(tree).toEqual(trees[1]);
    expect(repoMock.findById).toHaveBeenCalledWith('2');
  });

  it('should throw NotFoundError if tree not found', () => {
      const repoMock: Partial<TreeRepositoryPort> = {
          findById: jest.fn().mockReturnValue(undefined)
      };
      const treeService = new TreeService(repoMock as TreeRepositoryPort);

      expect(() => treeService.get('unknown')).toThrow(NotFoundError);
  });

  it('should list all trees', () => {
     const trees: Tree[] = [{ id: '1', birth: new Date(), species: Species.OAK, exposure: Exposure.SUNNY, carbonStorageCapacity: 10 }];
     const repoMock: Partial<TreeRepositoryPort> = {
         findAll: jest.fn().mockReturnValue(trees)
     };
     const treeService = new TreeService(repoMock as TreeRepositoryPort);
     expect(treeService.list()).toEqual(trees);
  });

  it('should save a tree', () => {
      const tree: Tree = { birth: new Date(), species: Species.OAK, exposure: Exposure.SUNNY, carbonStorageCapacity: 10 };
      const repoMock: Partial<TreeRepositoryPort> = {
          insert: jest.fn().mockReturnValue({ ...tree, id: '1' })
      };
      const treeService = new TreeService(repoMock as TreeRepositoryPort);
      
      const result = treeService.save(tree);
      expect(result.id).toBe('1');
  });

  it('should update a tree', () => {
      const tree: Tree = { id: '1', birth: new Date(), species: Species.OAK, exposure: Exposure.SUNNY, carbonStorageCapacity: 10 };
      const repoMock: Partial<TreeRepositoryPort> = {
          findById: jest.fn().mockReturnValue(tree),
          update: jest.fn().mockReturnValue(tree)
      };
      const treeService = new TreeService(repoMock as TreeRepositoryPort);
      
      const result = treeService.update('1', tree);
      expect(result).toEqual(tree);
  });

  it('should delete a tree', () => {
        const repoMock: Partial<TreeRepositoryPort> = {
            delete: jest.fn().mockReturnValue(true)
        };
        const treeService = new TreeService(repoMock as TreeRepositoryPort);
        expect(treeService.delete('1')).toBe(true);
  });
});