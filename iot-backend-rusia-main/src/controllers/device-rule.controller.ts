import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Device,
  Rule,
} from '../models';
import {DeviceRepository} from '../repositories';

export class DeviceRuleController {
  constructor(
    @repository(DeviceRepository) protected deviceRepository: DeviceRepository,
  ) { }

  @get('/devices/{id}/rules', {
    responses: {
      '200': {
        description: 'Array of Device has many Rule',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Rule)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Rule>,
  ): Promise<Rule[]> {
    return this.deviceRepository.rules(id).find(filter);
  }

  @post('/devices/{id}/rules', {
    responses: {
      '200': {
        description: 'Device model instance',
        content: {'application/json': {schema: getModelSchemaRef(Rule)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Device.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Rule, {
            title: 'NewRuleInDevice',
            exclude: ['id'],
            optional: ['deviceId']
          }),
        },
      },
    }) rule: Omit<Rule, 'id'>,
  ): Promise<Rule> {
    return this.deviceRepository.rules(id).create(rule);
  }

  @patch('/devices/{id}/rules', {
    responses: {
      '200': {
        description: 'Device.Rule PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Rule, {partial: true}),
        },
      },
    })
    rule: Partial<Rule>,
    @param.query.object('where', getWhereSchemaFor(Rule)) where?: Where<Rule>,
  ): Promise<Count> {
    return this.deviceRepository.rules(id).patch(rule, where);
  }

  @del('/devices/{id}/rules', {
    responses: {
      '200': {
        description: 'Device.Rule DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Rule)) where?: Where<Rule>,
  ): Promise<Count> {
    return this.deviceRepository.rules(id).delete(where);
  }
}
