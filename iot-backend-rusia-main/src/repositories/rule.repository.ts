import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Rule, RuleRelations} from '../models';

export class RuleRepository extends DefaultCrudRepository<
  Rule,
  typeof Rule.prototype.id,
  RuleRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Rule, dataSource);
  }
}
