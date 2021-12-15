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
  Location,
  Greenhouse,
} from '../models';
import {LocationRepository} from '../repositories';

export class LocationGreenhouseController {
  constructor(
    @repository(LocationRepository) protected locationRepository: LocationRepository,
  ) { }

  @get('/locations/{id}/greenhouses', {
    responses: {
      '200': {
        description: 'Array of Location has many Greenhouse',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Greenhouse)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Greenhouse>,
  ): Promise<Greenhouse[]> {
    return this.locationRepository.greenhouses(id).find(filter);
  }

  @post('/locations/{id}/greenhouses', {
    responses: {
      '200': {
        description: 'Location model instance',
        content: {'application/json': {schema: getModelSchemaRef(Greenhouse)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Location.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Greenhouse, {
            title: 'NewGreenhouseInLocation',
            exclude: ['id'],
            optional: ['locationId']
          }),
        },
      },
    }) greenhouse: Omit<Greenhouse, 'id'>,
  ): Promise<Greenhouse> {
    return this.locationRepository.greenhouses(id).create(greenhouse);
  }

  @patch('/locations/{id}/greenhouses', {
    responses: {
      '200': {
        description: 'Location.Greenhouse PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Greenhouse, {partial: true}),
        },
      },
    })
    greenhouse: Partial<Greenhouse>,
    @param.query.object('where', getWhereSchemaFor(Greenhouse)) where?: Where<Greenhouse>,
  ): Promise<Count> {
    return this.locationRepository.greenhouses(id).patch(greenhouse, where);
  }

  @del('/locations/{id}/greenhouses', {
    responses: {
      '200': {
        description: 'Location.Greenhouse DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Greenhouse)) where?: Where<Greenhouse>,
  ): Promise<Count> {
    return this.locationRepository.greenhouses(id).delete(where);
  }
}
