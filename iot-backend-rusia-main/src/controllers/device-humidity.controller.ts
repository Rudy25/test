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
  Humidity,
} from '../models';
import {DeviceRepository} from '../repositories';

export class DeviceHumidityController {
  constructor(
    @repository(DeviceRepository) protected deviceRepository: DeviceRepository,
  ) { }

  @get('/devices/{id}/humidities', {
    responses: {
      '200': {
        description: 'Array of Device has many Humidity',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Humidity)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Humidity>,
  ): Promise<Humidity[]> {
    return this.deviceRepository.humidities(id).find(filter);
  }

  @post('/devices/{id}/humidities', {
    responses: {
      '200': {
        description: 'Device model instance',
        content: {'application/json': {schema: getModelSchemaRef(Humidity)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Device.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Humidity, {
            title: 'NewHumidityInDevice',
            exclude: ['id'],
            optional: ['deviceId']
          }),
        },
      },
    }) humidity: Omit<Humidity, 'id'>,
  ): Promise<Humidity> {
    return this.deviceRepository.humidities(id).create(humidity);
  }

  @patch('/devices/{id}/humidities', {
    responses: {
      '200': {
        description: 'Device.Humidity PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Humidity, {partial: true}),
        },
      },
    })
    humidity: Partial<Humidity>,
    @param.query.object('where', getWhereSchemaFor(Humidity)) where?: Where<Humidity>,
  ): Promise<Count> {
    return this.deviceRepository.humidities(id).patch(humidity, where);
  }

  @del('/devices/{id}/humidities', {
    responses: {
      '200': {
        description: 'Device.Humidity DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Humidity)) where?: Where<Humidity>,
  ): Promise<Count> {
    return this.deviceRepository.humidities(id).delete(where);
  }
}
