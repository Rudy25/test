import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Device,
  SensorModel,
} from '../models';
import {DeviceRepository} from '../repositories';

export class DeviceSensorModelController {
  constructor(
    @repository(DeviceRepository)
    public deviceRepository: DeviceRepository,
  ) { }

  @get('/devices/{id}/sensor-model', {
    responses: {
      '200': {
        description: 'SensorModel belonging to Device',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(SensorModel)},
          },
        },
      },
    },
  })
  async getSensorModel(
    @param.path.string('id') id: typeof Device.prototype.id,
  ): Promise<SensorModel> {
    return this.deviceRepository.sensorModel(id);
  }
}
