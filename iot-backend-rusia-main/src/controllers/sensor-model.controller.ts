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
import {Element as el, SensorModel} from '../models';
import {ElementRepository, SensorModelRepository} from '../repositories';

export class SensorModelController {
  constructor(
    @repository(SensorModelRepository)
    public sensorModelRepository: SensorModelRepository,

    @repository(ElementRepository)
    public elementRepository: ElementRepository,
  ) {}

  @post('/sensor-models')
  @response(200, {
    description: 'SensorModel model instance',
    content: {'application/json': {schema: getModelSchemaRef(SensorModel)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SensorModel, {
            title: 'NewSensorModel',
            exclude: ['id'],
          }),
        },
      },
    })
    sensorModel: Omit<SensorModel, 'id'>,
  ): Promise<SensorModel> {
    return this.sensorModelRepository.create(sensorModel);
  }

  @get('/sensor-models')
  @response(200, {
    description: 'Array of SensorModel model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(SensorModel, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(SensorModel) filter?: Filter<SensorModel>,
    @param.query.string('search') search?: string,
  ): Promise<{results: SensorModel[]; count: number}> {
    let _search: any = search ? new RegExp(search, 'i') : '';

    let where: any = {
      deleted: {
        neq: true,
      },
      or: [{code: {like: _search || ''}}, {name: {like: _search || ''}}],
    };

    const results: SensorModel[] = await this.sensorModelRepository.find({
      ...filter,
      where,
    });

    for (let index = 0; index < results.length; index++) {
      results[index].elements = [];
      for (let i = 0; i < results[index].elementIds.length; i++) {
        const e: el = await this.elementRepository.findById(
          results[index].elementIds[i],
        );
        results[index].elements?.push(e);
      }
    }
    return {
      results,
      count: (
        await this.sensorModelRepository.count({
          ...where,
        })
      ).count,
    };
  }

  @patch('/sensor-models')
  @response(200, {
    description: 'SensorModel PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SensorModel, {partial: true}),
        },
      },
    })
    sensorModel: SensorModel,
    @param.where(SensorModel) where?: Where<SensorModel>,
  ): Promise<Count> {
    return this.sensorModelRepository.updateAll(sensorModel, where);
  }

  @get('/sensor-models/{id}')
  @response(200, {
    description: 'SensorModel model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(SensorModel, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(SensorModel, {exclude: 'where'})
    filter?: FilterExcludingWhere<SensorModel>,
  ): Promise<SensorModel> {
    return this.sensorModelRepository.findById(id, filter);
  }

  @patch('/sensor-models/{id}')
  @response(204, {
    description: 'SensorModel PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SensorModel, {partial: true}),
        },
      },
    })
    sensorModel: SensorModel,
  ): Promise<void> {
    await this.sensorModelRepository.updateById(id, sensorModel);
  }

  @put('/sensor-models/{id}')
  @response(204, {
    description: 'SensorModel PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() sensorModel: SensorModel,
  ): Promise<void> {
    await this.sensorModelRepository.replaceById(id, sensorModel);
  }

  @del('/sensor-models/{id}')
  @response(204, {
    description: 'SensorModel DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.sensorModelRepository.updateById(id, {
      deleted: true,
      name: `DELETED ${
        (
          await this.sensorModelRepository.findById(id)
        ).name
      } at ${new Date().toISOString()}`,
    });
  }
}
