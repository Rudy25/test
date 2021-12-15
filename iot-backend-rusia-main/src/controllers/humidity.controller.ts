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
import {Humidity} from '../models';
import {HumidityRepository} from '../repositories';

export class HumidityController {
  constructor(
    @repository(HumidityRepository)
    public humidityRepository: HumidityRepository,
  ) {}

  @post('/humidities')
  @response(200, {
    description: 'Humidity model instance',
    content: {'application/json': {schema: getModelSchemaRef(Humidity)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Humidity, {
            title: 'NewHumidity',
            exclude: ['id'],
          }),
        },
      },
    })
    humidity: Omit<Humidity, 'id'>,
  ): Promise<Humidity> {
    console.log(humidity);

    return this.humidityRepository.create({
      ...humidity,
      date: new Date().toISOString(),
    });
  }

  @get('/humidities/count')
  @response(200, {
    description: 'Humidity model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Humidity) where?: Where<Humidity>): Promise<Count> {
    return this.humidityRepository.count(where);
  }

  @get('/humidities')
  @response(200, {
    description: 'Array of Humidity model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Humidity, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Humidity) filter?: Filter<Humidity>,
  ): Promise<Humidity[]> {
    return this.humidityRepository.find(filter);
  }

  @patch('/humidities')
  @response(200, {
    description: 'Humidity PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Humidity, {partial: true}),
        },
      },
    })
    humidity: Humidity,
    @param.where(Humidity) where?: Where<Humidity>,
  ): Promise<Count> {
    return this.humidityRepository.updateAll(humidity, where);
  }

  @get('/humidities/{id}')
  @response(200, {
    description: 'Humidity model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Humidity, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Humidity, {exclude: 'where'})
    filter?: FilterExcludingWhere<Humidity>,
  ): Promise<Humidity> {
    return this.humidityRepository.findById(id, filter);
  }

  @patch('/humidities/{id}')
  @response(204, {
    description: 'Humidity PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Humidity, {partial: true}),
        },
      },
    })
    humidity: Humidity,
  ): Promise<void> {
    await this.humidityRepository.updateById(id, humidity);
  }

  @put('/humidities/{id}')
  @response(204, {
    description: 'Humidity PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() humidity: Humidity,
  ): Promise<void> {
    await this.humidityRepository.replaceById(id, humidity);
  }

  @del('/humidities/{id}')
  @response(204, {
    description: 'Humidity DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.humidityRepository.deleteById(id);
  }
}
