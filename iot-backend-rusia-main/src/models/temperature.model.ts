import {Entity, model, property} from '@loopback/repository';

@model()
export class Temperature extends Entity {
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

  constructor(data?: Partial<Temperature>) {
    super(data);
  }
}

export interface TemperatureRelations {
  // describe navigational properties here
}

export type TemperatureWithRelations = Temperature & TemperatureRelations;
