import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {Co2} from '../models';
import {Co2Repository} from '../repositories';

export class Co2Controller {
  constructor(
    @repository(Co2Repository)
    public co2Repository: Co2Repository,
  ) {}

  @post('/co2s')
  @response(200, {
    description: 'Co2 model instance',
    content: {'application/json': {schema: getModelSchemaRef(Co2)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Co2, {
            title: 'NewCo2',
            exclude: ['id'],
          }),
        },
      },
    })
    co2: Omit<Co2, 'id'>,
  ): Promise<Co2> {
    return this.co2Repository.create({...co2, date: new Date().toISOString()});
  }

  @get('/co2s/count')
  @response(200, {
    description: 'Co2 model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Co2) where?: Where<Co2>): Promise<Count> {
    return this.co2Repository.count(where);
  }

  @get('/co2s')
  @response(200, {
    description: 'Array of Co2 model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Co2, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Co2) filter?: Filter<Co2>): Promise<Co2[]> {
    return this.co2Repository.find(filter);
  }

  @patch('/co2s')
  @response(200, {
    description: 'Co2 PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Co2, {partial: true}),
        },
      },
    })
    co2: Co2,
    @param.where(Co2) where?: Where<Co2>,
  ): Promise<Count> {
    return this.co2Repository.updateAll(co2, where);
  }

  @get('/co2s/{id}')
  @response(200, {
    description: 'Co2 model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Co2, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Co2, {exclude: 'where'}) filter?: FilterExcludingWhere<Co2>,
  ): Promise<Co2> {
    return this.co2Repository.findById(id, filter);
  }

  @patch('/co2s/{id}')
  @response(204, {
    description: 'Co2 PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Co2, {partial: true}),
        },
      },
    })
    co2: Co2,
  ): Promise<void> {
    await this.co2Repository.updateById(id, co2);
  }

  @put('/co2s/{id}')
  @response(204, {
    description: 'Co2 PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() co2: Co2,
  ): Promise<void> {
    await this.co2Repository.replaceById(id, co2);
  }

  @del('/co2s/{id}')
  @response(204, {
    description: 'Co2 DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.co2Repository.deleteById(id);
  }
}
