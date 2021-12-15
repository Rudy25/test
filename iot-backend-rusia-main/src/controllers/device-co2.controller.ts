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
  Co2,
} from '../models';
import {DeviceRepository} from '../repositories';

export class DeviceCo2Controller {
  constructor(
    @repository(DeviceRepository) protected deviceRepository: DeviceRepository,
  ) { }

  @get('/devices/{id}/co2s', {
    responses: {
      '200': {
        description: 'Array of Device has many Co2',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Co2)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Co2>,
  ): Promise<Co2[]> {
    return this.deviceRepository.co2s(id).find(filter);
  }

  @post('/devices/{id}/co2s', {
    responses: {
      '200': {
        description: 'Device model instance',
        content: {'application/json': {schema: getModelSchemaRef(Co2)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Device.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Co2, {
            title: 'NewCo2InDevice',
            exclude: ['id'],
            optional: ['deviceId']
          }),
        },
      },
    }) co2: Omit<Co2, 'id'>,
  ): Promise<Co2> {
    return this.deviceRepository.co2s(id).create(co2);
  }

  @patch('/devices/{id}/co2s', {
    responses: {
      '200': {
        description: 'Device.Co2 PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Co2, {partial: true}),
        },
      },
    })
    co2: Partial<Co2>,
    @param.query.object('where', getWhereSchemaFor(Co2)) where?: Where<Co2>,
  ): Promise<Count> {
    return this.deviceRepository.co2s(id).patch(co2, where);
  }

  @del('/devices/{id}/co2s', {
    responses: {
      '200': {
        description: 'Device.Co2 DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Co2)) where?: Where<Co2>,
  ): Promise<Count> {
    return this.deviceRepository.co2s(id).delete(where);
  }
}
