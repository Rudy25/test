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
import {Element} from '../models';
import {ElementRepository} from '../repositories';

// @authenticate('jwt')
export class ElementController {
  constructor(
    @repository(ElementRepository)
    public elementRepository: ElementRepository,
  ) {}

  @post('/elements')
  @response(200, {
    description: 'Element model instance',
    content: {'application/json': {schema: getModelSchemaRef(Element)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Element, {
            title: 'NewElement',
            exclude: ['id'],
          }),
        },
      },
    })
    element: Omit<Element, 'id'>,
  ): Promise<Element> {
    return this.elementRepository.create(element);
  }

  @get('/elements/count')
  @response(200, {
    description: 'Element model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Element) where?: Where<Element>): Promise<Count> {
    return this.elementRepository.count(where);
  }

  @get('/elements')
  @response(200, {
    description: 'Array of Element model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Element, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Element) filter?: Filter<Element>,
  ): Promise<Element[]> {
    return this.elementRepository.find(filter);
  }

  @patch('/elements')
  @response(200, {
    description: 'Element PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Element, {partial: true}),
        },
      },
    })
    element: Element,
    @param.where(Element) where?: Where<Element>,
  ): Promise<Count> {
    return this.elementRepository.updateAll(element, where);
  }

  @get('/elements/{id}')
  @response(200, {
    description: 'Element model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Element, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Element, {exclude: 'where'})
    filter?: FilterExcludingWhere<Element>,
  ): Promise<Element> {
    return this.elementRepository.findById(id, filter);
  }

  @patch('/elements/{id}')
  @response(204, {
    description: 'Element PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Element, {partial: true}),
        },
      },
    })
    element: Element,
  ): Promise<void> {
    await this.elementRepository.updateById(id, element);
  }

  @put('/elements/{id}')
  @response(204, {
    description: 'Element PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() element: Element,
  ): Promise<void> {
    await this.elementRepository.replaceById(id, element);
  }

  @del('/elements/{id}')
  @response(204, {
    description: 'Element DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.elementRepository.deleteById(id);
  }
}
