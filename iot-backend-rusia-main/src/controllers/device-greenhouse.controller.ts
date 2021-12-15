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
  Greenhouse,
} from '../models';
import {DeviceRepository} from '../repositories';

export class DeviceGreenhouseController {
  constructor(
    @repository(DeviceRepository)
    public deviceRepository: DeviceRepository,
  ) { }

  @get('/devices/{id}/greenhouse', {
    responses: {
      '200': {
        description: 'Greenhouse belonging to Device',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Greenhouse)},
          },
        },
      },
    },
  })
  async getGreenhouse(
    @param.path.string('id') id: typeof Device.prototype.id,
  ): Promise<Greenhouse> {
    return this.deviceRepository.greenhouse(id);
  }
}
