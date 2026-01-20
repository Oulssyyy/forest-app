"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Species_1 = require("../models/Species");
const Exposure_1 = require("../models/Exposure");
const TreeService_1 = require("./TreeService");
describe('TreeService', () => {
    it('should get the correct tree by UUID', () => {
        // Arrange
        const trees = [
            { id: '1', birth: new Date('2020-01-01'), species: Species_1.Species.OAK, exposure: Exposure_1.Exposure.SUNNY, carbonStorageCapacity: 100 },
            { id: '2', birth: new Date('2019-05-15'), species: Species_1.Species.ASH, exposure: Exposure_1.Exposure.MID_SHADOW, carbonStorageCapacity: 150 }
        ];
        const repoMock = {
            findAll: jest.fn().mockReturnValue(trees),
            insert: jest.fn()
        };
        const treeService = new TreeService_1.TreeService(repoMock);
        // Act
        const tree = treeService.get('2');
        // Assert
        expect(tree).toEqual(trees[1]);
        expect(repoMock.findAll).toHaveBeenCalled();
    });
});
