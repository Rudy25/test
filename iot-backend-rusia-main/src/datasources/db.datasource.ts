import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'db',
  connector: 'mongodb',
  // url: 'mongodb+srv://iotdev:uJ9nm3rDJpTbH4F8@iot.krosa.mongodb.net/test?retryWrites=true&w=majority&ssl=true',
  host: 'localhost', //'34.132.22.210', // 'iot.krosa.mongodb.net'
  port: 27017,
  // user: 'iotdev',
  // password: 'uJ9nm3rDJpTbH4F8',
  database: 'test',
  useNewUrlParser: true,
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class DbDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = 'db';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.db', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
