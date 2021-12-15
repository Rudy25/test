import {
  belongsTo,
  Entity,
  hasMany,
  model,
  property,
} from '@loopback/repository';
import {Device} from './device.model';
import {Location} from './location.model';

@model()
export class Greenhouse extends Entity {
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
    type: 'boolean',
    default: false,
  })
  deleted: boolean;

  @property({
    type: 'any',
  })
  reference?: string;

  @hasMany(() => Device)
  devices: Device[];

  @belongsTo(() => Location)
  locationId: string;

  constructor(data?: Partial<Greenhouse>) {
    super(data);
  }
}

export interface GreenhouseRelations {
  // describe navigational properties here
}

export type GreenhouseWithRelations = Greenhouse & GreenhouseRelations;
