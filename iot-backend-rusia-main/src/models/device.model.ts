import {
  belongsTo,
  Entity,
  hasMany,
  model,
  property,
} from '@loopback/repository';
import {Co2} from './co2.model';
import {Greenhouse} from './greenhouse.model';
import {Humidity} from './humidity.model';
import {SensorModel} from './sensor-model.model';
import {Temperature} from './temperature.model';
import {Rule} from './rule.model';

@model()
export class Device extends Entity {
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
  })
  code?: string;

  @property({
    type: 'string',
  })
  templateId?: string;

  @property({
    type: 'boolean',
    default: false,
  })
  deleted?: boolean;

  @hasMany(() => Temperature)
  temperatures: Temperature[];

  @hasMany(() => Humidity)
  humidities: Humidity[];

  @hasMany(() => Co2)
  co2s: Co2[];

  @belongsTo(() => Greenhouse)
  greenhouseId: string;

  @belongsTo(() => SensorModel)
  sensorModelId: string;

  @hasMany(() => Rule)
  rules: Rule[];

  constructor(data?: Partial<Device>) {
    super(data);
  }
}

export interface DeviceRelations {
  // describe navigational properties here
}

export type DeviceWithRelations = Device & DeviceRelations;
