import {Entity, hasMany, model, property} from '@loopback/repository';
import {Greenhouse} from './greenhouse.model';

@model()
export class Location extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
  })
  address?: string;

  @property({
    type: 'any',
  })
  reference?: string;

  @property({
    type: 'boolean',
    default: false,
  })
  deleted?: boolean;

  @hasMany(() => Greenhouse)
  greenhouses: Greenhouse[];

  constructor(data?: Partial<Location>) {
    super(data);
  }
}

export interface LocationRelations {
  // describe navigational properties here
}

export type LocationWithRelations = Location & LocationRelations;
