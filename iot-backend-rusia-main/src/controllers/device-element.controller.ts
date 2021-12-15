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
  Element,
} from '../models';
import {DeviceRepository} from '../repositories';

export class DeviceElementController {
  constructor(
    @repository(DeviceRepository)
    public deviceRepository: DeviceRepository,
  ) { }

  @get('/devices/{id}/element', {
    responses: {
      '200': {
        description: 'Element belonging to Device',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Element)},
          },
        },
      },
    },
  })
  async getElement(
    @param.path.string('id') id: typeof Device.prototype.id,
  ): Promise<Element> {
    return this.deviceRepository.element(id);
  }
}
