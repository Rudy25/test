import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Co2, Co2Relations} from '../models';

export class Co2Repository extends DefaultCrudRepository<
  Co2,
  typeof Co2.prototype.id,
  Co2Relations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Co2, dataSource);
  }
}
