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
  Temperature,
} from '../models';
import {DeviceRepository} from '../repositories';

export class DeviceTemperatureController {
  constructor(
    @repository(DeviceRepository) protected deviceRepository: DeviceRepository,
  ) { }

  @get('/devices/{id}/temperatures', {
    responses: {
      '200': {
        description: 'Array of Device has many Temperature',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Temperature)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Temperature>,
  ): Promise<Temperature[]> {
    return this.deviceRepository.temperatures(id).find(filter);
  }

  @post('/devices/{id}/temperatures', {
    responses: {
      '200': {
        description: 'Device model instance',
        content: {'application/json': {schema: getModelSchemaRef(Temperature)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Device.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Temperature, {
            title: 'NewTemperatureInDevice',
            exclude: ['id'],
            optional: ['deviceId']
          }),
        },
      },
    }) temperature: Omit<Temperature, 'id'>,
  ): Promise<Temperature> {
    return this.deviceRepository.temperatures(id).create(temperature);
  }

  @patch('/devices/{id}/temperatures', {
    responses: {
      '200': {
        description: 'Device.Temperature PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Temperature, {partial: true}),
        },
      },
    })
    temperature: Partial<Temperature>,
    @param.query.object('where', getWhereSchemaFor(Temperature)) where?: Where<Temperature>,
  ): Promise<Count> {
    return this.deviceRepository.temperatures(id).patch(temperature, where);
  }

  @del('/devices/{id}/temperatures', {
    responses: {
      '200': {
        description: 'Device.Temperature DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Temperature)) where?: Where<Temperature>,
  ): Promise<Count> {
    return this.deviceRepository.temperatures(id).delete(where);
  }
}
