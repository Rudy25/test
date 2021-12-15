import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Greenhouse,
  Location,
} from '../models';
import {GreenhouseRepository} from '../repositories';

export class GreenhouseLocationController {
  constructor(
    @repository(GreenhouseRepository)
    public greenhouseRepository: GreenhouseRepository,
  ) { }

  @get('/greenhouses/{id}/location', {
    responses: {
      '200': {
        description: 'Location belonging to Greenhouse',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Location)},
          },
        },
      },
    },
  })
  async getLocation(
    @param.path.string('id') id: typeof Greenhouse.prototype.id,
  ): Promise<Location> {
    return this.greenhouseRepository.location(id);
  }
}
