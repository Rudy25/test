import {Entity, model, property} from '@loopback/repository';

@model()
export class Humidity extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'date',
  })
  date?: string;

  @property({
    type: 'number',
    required: true,
  })
  value: number;

  @property({
    type: 'string',
  })
  deviceId?: string;

  constructor(data?: Partial<Humidity>) {
    super(data);
  }
}

export interface HumidityRelations {
  // describe navigational properties here
}

export type HumidityWithRelations = Humidity & HumidityRelations;
