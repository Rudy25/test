import {Entity, hasMany, model, property} from '@loopback/repository';
import {Widget} from '.';
import {Device} from './device.model';

@model()
export class Template extends Entity {
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
  description?: string;

  @property({
    type: 'any',
    required: true,
  })
  widgets?: Widget[];

  @property({
    type: 'date',
    default: new Date(),
  })
  createdAt?: string;

  @hasMany(() => Device)
  devices: Device[];

  constructor(data?: Partial<Template>) {
    super(data);
  }
}

export interface TemplateRelations {
  // describe navigational properties here
}

export type TemplateWithRelations = Template & TemplateRelations;
