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
  SensorModel,
  Device,
} from '../models';
import {SensorModelRepository} from '../repositories';

export class SensorModelDeviceController {
  constructor(
    @repository(SensorModelRepository) protected sensorModelRepository: SensorModelRepository,
  ) { }

  @get('/sensor-models/{id}/devices', {
    responses: {
      '200': {
        description: 'Array of SensorModel has many Device',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Device)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Device>,
  ): Promise<Device[]> {
    return this.sensorModelRepository.devices(id).find(filter);
  }

  @post('/sensor-models/{id}/devices', {
    responses: {
      '200': {
        description: 'SensorModel model instance',
        content: {'application/json': {schema: getModelSchemaRef(Device)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof SensorModel.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Device, {
            title: 'NewDeviceInSensorModel',
            exclude: ['id'],
            optional: ['sensorModelId']
          }),
        },
      },
    }) device: Omit<Device, 'id'>,
  ): Promise<Device> {
    return this.sensorModelRepository.devices(id).create(device);
  }

  @patch('/sensor-models/{id}/devices', {
    responses: {
      '200': {
        description: 'SensorModel.Device PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Device, {partial: true}),
        },
      },
    })
    device: Partial<Device>,
    @param.query.object('where', getWhereSchemaFor(Device)) where?: Where<Device>,
  ): Promise<Count> {
    return this.sensorModelRepository.devices(id).patch(device, where);
  }

  @del('/sensor-models/{id}/devices', {
    responses: {
      '200': {
        description: 'SensorModel.Device DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Device)) where?: Where<Device>,
  ): Promise<Count> {
    return this.sensorModelRepository.devices(id).delete(where);
  }
}
