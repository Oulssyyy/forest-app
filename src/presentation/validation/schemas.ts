import { z } from 'zod';
import { Species } from '../../domain/models/Species';
import { Exposure } from '../../domain/models/Exposure';
import { ForestType } from '../../domain/models/ForestType';

export const CreateTreeSchema = z.object({
    id: z.string().uuid().optional(),
    birth: z.coerce.date(),
    species: z.nativeEnum(Species),
    exposure: z.nativeEnum(Exposure),
    carbonStorageCapacity: z.number().positive(),
});

export const UpdateTreeSchema = CreateTreeSchema.omit({ id: true });

export const CreateForestSchema = z.object({
    id: z.string().uuid().optional(),
    type: z.nativeEnum(ForestType),
    surface: z.number().positive(),
    treeIds: z.array(z.string().uuid()).optional().default([]),
});

export const UpdateForestSchema = CreateForestSchema.omit({ id: true });

export const AddTreeToForestSchema = z.object({
    treeId: z.string().uuid()
});
