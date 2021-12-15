import {inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Device, Element, ElementRelations} from '../models';

export class ElementRepository extends DefaultCrudRepository<
  Element,
  typeof Element.prototype.id,
  ElementRelations
> {
  public readonly devices: HasManyRepositoryFactory<
    Device,
    typeof Element.prototype.id
  >;

  constructor(@inject('datasources.db') dataSource: DbDataSource) {
    super(Element, dataSource);
  }
}
