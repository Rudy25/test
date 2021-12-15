import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Template, TemplateRelations, Device} from '../models';
import {DeviceRepository} from './device.repository';

export class TemplateRepository extends DefaultCrudRepository<
  Template,
  typeof Template.prototype.id,
  TemplateRelations
> {

  public readonly devices: HasManyRepositoryFactory<Device, typeof Template.prototype.id>;

  constructor(@inject('datasources.db') dataSource: DbDataSource, @repository.getter('DeviceRepository') protected deviceRepositoryGetter: Getter<DeviceRepository>,) {
    super(Template, dataSource);
    this.devices = this.createHasManyRepositoryFactoryFor('devices', deviceRepositoryGetter,);
    this.registerInclusionResolver('devices', this.devices.inclusionResolver);
  }
}
