import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import {RestApiDataSource} from '../datasources';

export interface RestApiEMQX {
  // this is where you define the Node.js methods that will be
  // mapped to REST/SOAP/gRPC operations as stated in the datasource
  // json file.
  getResources(): Promise<object>;
  getRules(): Promise<object>;
  createRule(body: {}): Promise<object>;
  deleteRule(id: string): Promise<object>;
  updateRule(id: string, body: {}): Promise<object>;
  createResource(id: string, body: {}): Promise<object>;
  deleteResource(id: string): Promise<object>;
  updateResource(id: string, body: {}): Promise<object>;
}

export class RestApiEMQXProvider implements Provider<RestApiEMQX> {
  constructor(
    // restApi must match the name property in the datasource json file
    @inject('datasources.restApiEMQX')
    protected dataSource: RestApiDataSource = new RestApiDataSource(),
  ) {}

  value(): Promise<RestApiEMQX> {
    return getService(this.dataSource);
  }
}
