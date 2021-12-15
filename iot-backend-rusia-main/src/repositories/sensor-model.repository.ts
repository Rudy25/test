import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Device, SensorModel, SensorModelRelations} from '../models';
import {DeviceRepository} from './device.repository';

export class SensorModelRepository extends DefaultCrudRepository<
  SensorModel,
  typeof SensorModel.prototype.id,
  SensorModelRelations
> {
  public readonly devices: HasManyRepositoryFactory<
    Device,
    typeof SensorModel.prototype.id
  >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('DeviceRepository')
    protected deviceRepositoryGetter: Getter<DeviceRepository>,
  ) {
    super(SensorModel, dataSource);
    this.devices = this.createHasManyRepositoryFactoryFor(
      'devices',
      deviceRepositoryGetter,
    );
    this.registerInclusionResolver('devices', this.devices.inclusionResolver);
  }
}
