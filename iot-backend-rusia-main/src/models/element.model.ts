import {Entity, model, property} from '@loopback/repository';

@model()
export class Element extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
    index: {
      unique: true,
    },
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  um: string;

  constructor(data?: Partial<Element>) {
    super(data);
  }
}

export interface ElementRelations {
  // describe navigational properties here
}

export type ElementWithRelations = Element & ElementRelations;
