import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {
  Co2,
  Device,
  DeviceRelations,
  Element,
  Greenhouse,
  Humidity,
  SensorModel,
  Temperature, Rule} from '../models';
import {Co2Repository} from './co2.repository';
import {GreenhouseRepository} from './greenhouse.repository';
import {HumidityRepository} from './humidity.repository';
import {SensorModelRepository} from './sensor-model.repository';
import {TemperatureRepository} from './temperature.repository';
import {RuleRepository} from './rule.repository';

export class DeviceRepository extends DefaultCrudRepository<
  Device,
  typeof Device.prototype.id,
  DeviceRelations
> {
  public readonly temperatures: HasManyRepositoryFactory<
    Temperature,
    typeof Device.prototype.id
  >;

  public readonly humidities: HasManyRepositoryFactory<
    Humidity,
    typeof Device.prototype.id
  >;

  public readonly co2s: HasManyRepositoryFactory<
    Co2,
    typeof Device.prototype.id
  >;

  public readonly element: BelongsToAccessor<
    Element,
    typeof Device.prototype.id
  >;

  public readonly greenhouse: BelongsToAccessor<
    Greenhouse,
    typeof Device.prototype.id
  >;

  public readonly sensorModel: BelongsToAccessor<
    SensorModel,
    typeof Device.prototype.id
  >;

  public readonly rules: HasManyRepositoryFactory<Rule, typeof Device.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('TemperatureRepository')
    protected temperatureRepositoryGetter: Getter<TemperatureRepository>,
    @repository.getter('HumidityRepository')
    protected humidityRepositoryGetter: Getter<HumidityRepository>,
    @repository.getter('Co2Repository')
    protected co2RepositoryGetter: Getter<Co2Repository>,
    @repository.getter('GreenhouseRepository')
    protected greenhouseRepositoryGetter: Getter<GreenhouseRepository>,
    @repository.getter('SensorModelRepository')
    protected sensorModelRepositoryGetter: Getter<SensorModelRepository>, @repository.getter('RuleRepository') protected ruleRepositoryGetter: Getter<RuleRepository>,
  ) {
    super(Device, dataSource);
    this.rules = this.createHasManyRepositoryFactoryFor('rules', ruleRepositoryGetter,);
    this.registerInclusionResolver('rules', this.rules.inclusionResolver);
    this.sensorModel = this.createBelongsToAccessorFor(
      'sensorModel',
      sensorModelRepositoryGetter,
    );
    this.registerInclusionResolver(
      'sensorModel',
      this.sensorModel.inclusionResolver,
    );
    this.greenhouse = this.createBelongsToAccessorFor(
      'greenhouse',
      greenhouseRepositoryGetter,
    );
    this.registerInclusionResolver(
      'greenhouse',
      this.greenhouse.inclusionResolver,
    );

    this.co2s = this.createHasManyRepositoryFactoryFor(
      'co2s',
      co2RepositoryGetter,
    );
    this.registerInclusionResolver('co2s', this.co2s.inclusionResolver);
    this.humidities = this.createHasManyRepositoryFactoryFor(
      'humidities',
      humidityRepositoryGetter,
    );
    this.registerInclusionResolver(
      'humidities',
      this.humidities.inclusionResolver,
    );
    this.temperatures = this.createHasManyRepositoryFactoryFor(
      'temperatures',
      temperatureRepositoryGetter,
    );
    this.registerInclusionResolver(
      'temperatures',
      this.temperatures.inclusionResolver,
    );
  }
}
