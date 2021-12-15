import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Template} from '../models';
import {TemplateRepository} from '../repositories';

export class TemplateController {
  constructor(
    @repository(TemplateRepository)
    public templateRepository : TemplateRepository,
  ) {}

  @post('/templates')
  @response(200, {
    description: 'Template model instance',
    content: {'application/json': {schema: getModelSchemaRef(Template)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Template, {
            title: 'NewTemplate',
            exclude: ['id'],
          }),
        },
      },
    })
    template: Omit<Template, 'id'>,
  ): Promise<Template> {
    return this.templateRepository.create(template);
  }

  @get('/templates/count')
  @response(200, {
    description: 'Template model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Template) where?: Where<Template>,
  ): Promise<Count> {
    return this.templateRepository.count(where);
  }

  @get('/templates')
  @response(200, {
    description: 'Array of Template model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Template, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Template) filter?: Filter<Template>,
  ): Promise<Template[]> {
    return this.templateRepository.find(filter);
  }

  @patch('/templates')
  @response(200, {
    description: 'Template PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Template, {partial: true}),
        },
      },
    })
    template: Template,
    @param.where(Template) where?: Where<Template>,
  ): Promise<Count> {
    return this.templateRepository.updateAll(template, where);
  }

  @get('/templates/{id}')
  @response(200, {
    description: 'Template model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Template, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Template, {exclude: 'where'}) filter?: FilterExcludingWhere<Template>
  ): Promise<Template> {
    return this.templateRepository.findById(id, filter);
  }

  @patch('/templates/{id}')
  @response(204, {
    description: 'Template PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Template, {partial: true}),
        },
      },
    })
    template: Template,
  ): Promise<void> {
    await this.templateRepository.updateById(id, template);
  }

  @put('/templates/{id}')
  @response(204, {
    description: 'Template PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() template: Template,
  ): Promise<void> {
    await this.templateRepository.replaceById(id, template);
  }

  @del('/templates/{id}')
  @response(204, {
    description: 'Template DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.templateRepository.deleteById(id);
  }
}
