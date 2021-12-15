import {Model, model, property} from '@loopback/repository';

@model()
export class Widget extends Model {
  @property({
    type: 'string',
  })
  icon?: string;

  @property({
    type: 'string',
    required: true,
  })
  variableFullName?: string;

  @property({
    type: 'string',
  })
  variable?: string;

  @property({
    type: 'string',
  })
  unit?: string;

  @property({
    type: 'string',
  })
  class?: string;

  @property({
    type: 'string',
  })
  column?: string;

  @property({
    type: 'number',
    default: 2,
  })
  decimalPlaces?: number;

  @property({
    type: 'string',
  })
  widget?: string;

  @property({
    type: 'number',
    default: 0,
  })
  chartTimeAgo?: number;

  @property({
    type: 'boolean',
    default: true,
  })
  isDemo?: boolean;

  constructor(data?: Partial<Widget>) {
    super(data);
  }
}

export interface WidgetRelations {
  // describe navigational properties here
}

export type WidgetWithRelations = Widget & WidgetRelations;
