import {Entity, hasMany, model, property} from '@loopback/repository';
import {Device, Element as el} from './index';

@model()
export class SensorModel extends Entity {
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
  limits?: string;

  @property({
    type: 'boolean',
    default: false,
  })
  deleted?: boolean;

  @property({
    type: 'array',
    requerid: true,
    itemType: 'string',
  })
  elementIds: string[];

  @property({
    type: 'array',
    itemType: 'any',
  })
  elements?: el[];

  @hasMany(() => Device)
  devices: Device[];

  constructor(data?: Partial<SensorModel>) {
    super(data);
  }
}

export interface SensorModelRelations {
  // describe navigational properties here
}

export type SensorModelWithRelations = SensorModel & SensorModelRelations;
