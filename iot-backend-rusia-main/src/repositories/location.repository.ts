import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Location, LocationRelations, Greenhouse} from '../models';
import {GreenhouseRepository} from './greenhouse.repository';

export class LocationRepository extends DefaultCrudRepository<
  Location,
  typeof Location.prototype.id,
  LocationRelations
> {

  public readonly greenhouses: HasManyRepositoryFactory<Greenhouse, typeof Location.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('GreenhouseRepository') protected greenhouseRepositoryGetter: Getter<GreenhouseRepository>,
  ) {
    super(Location, dataSource);
    this.greenhouses = this.createHasManyRepositoryFactoryFor('greenhouses', greenhouseRepositoryGetter,);
    this.registerInclusionResolver('greenhouses', this.greenhouses.inclusionResolver);
  }
}
