import {Entity, model, property} from '@loopback/repository';

@model()
export class Co2 extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'number',
    required: true,
  })
  value: number;

  @property({
    type: 'date',
  })
  date?: string;

  @property({
    type: 'string',
  })
  deviceId?: string;

  constructor(data?: Partial<Co2>) {
    super(data);
  }
}

export interface Co2Relations {
  // describe navigational properties here
}

export type Co2WithRelations = Co2 & Co2Relations;
