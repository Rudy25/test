import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Temperature, TemperatureRelations} from '../models';

export class TemperatureRepository extends DefaultCrudRepository<
  Temperature,
  typeof Temperature.prototype.id,
  TemperatureRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Temperature, dataSource);
  }
}
