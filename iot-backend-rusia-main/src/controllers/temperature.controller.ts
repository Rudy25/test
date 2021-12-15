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
import {Temperature} from '../models';
import {TemperatureRepository} from '../repositories';

export class TemperatureController {
  constructor(
    @repository(TemperatureRepository)
    public temperatureRepository: TemperatureRepository,
  ) {}

  @post('/temperatures')
  @response(200, {
    description: 'Temperature model instance',
    content: {'application/json': {schema: getModelSchemaRef(Temperature)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Temperature, {
            title: 'NewTemperature',
            exclude: ['id'],
          }),
        },
      },
    })
    temperature: Omit<Temperature, 'id'>,
  ): Promise<Temperature> {
    console.log(temperature);

    return this.temperatureRepository.create({
      ...temperature,
      date: new Date().toISOString(),
    });
  }

  @get('/temperatures/count')
  @response(200, {
    description: 'Temperature model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Temperature) where?: Where<Temperature>,
  ): Promise<Count> {
    return this.temperatureRepository.count(where);
  }

  @get('/temperatures')
  @response(200, {
    description: 'Array of Temperature model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Temperature, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Temperature) filter?: Filter<Temperature>,
  ): Promise<Temperature[]> {
    return this.temperatureRepository.find(filter);
  }

  @patch('/temperatures')
  @response(200, {
    description: 'Temperature PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Temperature, {partial: true}),
        },
      },
    })
    temperature: Temperature,
    @param.where(Temperature) where?: Where<Temperature>,
  ): Promise<Count> {
    return this.temperatureRepository.updateAll(temperature, where);
  }

  @get('/temperatures/{id}')
  @response(200, {
    description: 'Temperature model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Temperature, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Temperature, {exclude: 'where'})
    filter?: FilterExcludingWhere<Temperature>,
  ): Promise<Temperature> {
    return this.temperatureRepository.findById(id, filter);
  }

  @patch('/temperatures/{id}')
  @response(204, {
    description: 'Temperature PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Temperature, {partial: true}),
        },
      },
    })
    temperature: Temperature,
  ): Promise<void> {
    await this.temperatureRepository.updateById(id, temperature);
  }

  @put('/temperatures/{id}')
  @response(204, {
    description: 'Temperature PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() temperature: Temperature,
  ): Promise<void> {
    await this.temperatureRepository.replaceById(id, temperature);
  }

  @del('/temperatures/{id}')
  @response(204, {
    description: 'Temperature DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.temperatureRepository.deleteById(id);
  }
}
