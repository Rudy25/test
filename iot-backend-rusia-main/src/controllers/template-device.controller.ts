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
  Template,
  Device,
} from '../models';
import {TemplateRepository} from '../repositories';

export class TemplateDeviceController {
  constructor(
    @repository(TemplateRepository) protected templateRepository: TemplateRepository,
  ) { }

  @get('/templates/{id}/devices', {
    responses: {
      '200': {
        description: 'Array of Template has many Device',
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
    return this.templateRepository.devices(id).find(filter);
  }

  @post('/templates/{id}/devices', {
    responses: {
      '200': {
        description: 'Template model instance',
        content: {'application/json': {schema: getModelSchemaRef(Device)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Template.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Device, {
            title: 'NewDeviceInTemplate',
            exclude: ['id'],
            optional: ['templateId']
          }),
        },
      },
    }) device: Omit<Device, 'id'>,
  ): Promise<Device> {
    return this.templateRepository.devices(id).create(device);
  }

  @patch('/templates/{id}/devices', {
    responses: {
      '200': {
        description: 'Template.Device PATCH success count',
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
    return this.templateRepository.devices(id).patch(device, where);
  }

  @del('/templates/{id}/devices', {
    responses: {
      '200': {
        description: 'Template.Device DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Device)) where?: Where<Device>,
  ): Promise<Count> {
    return this.templateRepository.devices(id).delete(where);
  }
}
