import {Entity, model, property} from '@loopback/repository';

@model()
export class Rule extends Entity {
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
  rawsql: string;

  @property({
    type: 'string',
    required: true,
  })
  topic: string;

  @property({
    type: 'string',
  })
  actions?: string;

  @property({
    type: 'boolean',
    default: true,
  })
  enabled?: boolean;

  @property({
    type: 'string',
    required: true,
  })
  ruleIdEmqx: string;
  @property({
    type: 'string',
  })
  elementId?: string;

  @property({
    type: 'string',
  })
  path?: string;

  @property({
    type: 'string',
  })
  deviceId?: string;

  constructor(data?: Partial<Rule>) {
    super(data);
  }
}

export interface RuleRelations {
  // describe navigational properties here
}

export type RuleWithRelations = Rule & RuleRelations;
