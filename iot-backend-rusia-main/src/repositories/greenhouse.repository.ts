import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Greenhouse, GreenhouseRelations, Device, Location} from '../models';
import {DeviceRepository} from './device.repository';
import {LocationRepository} from './location.repository';

export class GreenhouseRepository extends DefaultCrudRepository<
  Greenhouse,
  typeof Greenhouse.prototype.id,
  GreenhouseRelations
> {

  public readonly devices: HasManyRepositoryFactory<Device, typeof Greenhouse.prototype.id>;

  public readonly location: BelongsToAccessor<Location, typeof Greenhouse.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('DeviceRepository') protected deviceRepositoryGetter: Getter<DeviceRepository>, @repository.getter('LocationRepository') protected locationRepositoryGetter: Getter<LocationRepository>,
  ) {
    super(Greenhouse, dataSource);
    this.location = this.createBelongsToAccessorFor('location', locationRepositoryGetter,);
    this.registerInclusionResolver('location', this.location.inclusionResolver);
    this.devices = this.createHasManyRepositoryFactoryFor('devices', deviceRepositoryGetter,);
    this.registerInclusionResolver('devices', this.devices.inclusionResolver);
  }
}
