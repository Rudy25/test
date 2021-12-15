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
  Greenhouse,
  Device,
} from '../models';
import {GreenhouseRepository} from '../repositories';

export class GreenhouseDeviceController {
  constructor(
    @repository(GreenhouseRepository) protected greenhouseRepository: GreenhouseRepository,
  ) { }

  @get('/greenhouses/{id}/devices', {
    responses: {
      '200': {
        description: 'Array of Greenhouse has many Device',
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
    return this.greenhouseRepository.devices(id).find(filter);
  }

  @post('/greenhouses/{id}/devices', {
    responses: {
      '200': {
        description: 'Greenhouse model instance',
        content: {'application/json': {schema: getModelSchemaRef(Device)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Greenhouse.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Device, {
            title: 'NewDeviceInGreenhouse',
            exclude: ['id'],
            optional: ['greenhouseId']
          }),
        },
      },
    }) device: Omit<Device, 'id'>,
  ): Promise<Device> {
    return this.greenhouseRepository.devices(id).create(device);
  }

  @patch('/greenhouses/{id}/devices', {
    responses: {
      '200': {
        description: 'Greenhouse.Device PATCH success count',
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
    return this.greenhouseRepository.devices(id).patch(device, where);
  }

  @del('/greenhouses/{id}/devices', {
    responses: {
      '200': {
        description: 'Greenhouse.Device DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Device)) where?: Where<Device>,
  ): Promise<Count> {
    return this.greenhouseRepository.devices(id).delete(where);
  }
}
