import {authenticate} from '@loopback/authentication';
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
import {Greenhouse} from '../models';
import {GreenhouseRepository} from '../repositories';
@authenticate('jwt')
export class GreenhouseController {
  constructor(
    @repository(GreenhouseRepository)
    public greenhouseRepository: GreenhouseRepository,
  ) {}

  @post('/greenhouses')
  @response(200, {
    description: 'Greenhouse model instance',
    content: {'application/json': {schema: getModelSchemaRef(Greenhouse)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Greenhouse, {
            title: 'NewGreenhouse',
            exclude: ['id'],
          }),
        },
      },
    })
    greenhouse: Omit<Greenhouse, 'id'>,
  ): Promise<Greenhouse> {
    return this.greenhouseRepository.create(greenhouse);
  }

  @get('/greenhouses/count')
  @response(200, {
    description: 'Greenhouse model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Greenhouse) where?: Where<Greenhouse>,
  ): Promise<Count> {
    return this.greenhouseRepository.count(where);
  }

  @get('/greenhouses')
  @response(200, {
    description: 'Array of Greenhouse model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Greenhouse, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Greenhouse) filter?: Filter<Greenhouse>,
  ): Promise<{results: Greenhouse[]; count: number}> {
    return {
      results: await this.greenhouseRepository.find({
        ...filter,
        include: [{relation: 'devices'}, {relation: 'location'}],
        where: {
          deleted: {
            neq: true,
          },
        },
      }),
      count: (
        await this.greenhouseRepository.count({
          deleted: {
            neq: true,
          },
        })
      ).count,
    };
  }

  @patch('/greenhouses')
  @response(200, {
    description: 'Greenhouse PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Greenhouse, {partial: true}),
        },
      },
    })
    greenhouse: Greenhouse,
    @param.where(Greenhouse) where?: Where<Greenhouse>,
  ): Promise<Count> {
    return this.greenhouseRepository.updateAll(greenhouse, where);
  }

  @get('/greenhouses/{id}')
  @response(200, {
    description: 'Greenhouse model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Greenhouse, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Greenhouse, {exclude: 'where'})
    filter?: FilterExcludingWhere<Greenhouse>,
  ): Promise<Greenhouse> {
    return this.greenhouseRepository.findById(id, filter);
  }

  @patch('/greenhouses/{id}')
  @response(204, {
    description: 'Greenhouse PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Greenhouse, {partial: true}),
        },
      },
    })
    greenhouse: Greenhouse,
  ): Promise<void> {
    await this.greenhouseRepository.updateById(id, greenhouse);
  }

  @put('/greenhouses/{id}')
  @response(204, {
    description: 'Greenhouse PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() greenhouse: Greenhouse,
  ): Promise<void> {
    await this.greenhouseRepository.replaceById(id, greenhouse);
  }

  @del('/greenhouses/{id}')
  @response(204, {
    description: 'Greenhouse DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.greenhouseRepository.updateById(id, {
      deleted: true,
      name: `DELETED ${(await this.greenhouseRepository.findById(id)).name}`,
    });
  }
}
