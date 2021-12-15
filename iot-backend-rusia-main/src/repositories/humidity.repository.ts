import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Humidity, HumidityRelations} from '../models';

export class HumidityRepository extends DefaultCrudRepository<
  Humidity,
  typeof Humidity.prototype.id,
  HumidityRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Humidity, dataSource);
  }
}
