import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
const baseURL = 'http://localhost:8081/api/v4/'; //'http://34.67.113.110:8081/api/v4/';
const config = {
  name: 'restApiEMQX',
  connector: 'rest',
  baseURL,
  crud: false,
  options: {
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    auth: {
      username: 'admin',
      password: 'public',
    },
  },
  operations: [
    {
      template: {
        method: 'GET',
        url: `${baseURL}rules/`,
        options: {
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
          },
        },
      },
      functions: {
        getRules: [],
      },
    },
    {
      template: {
        method: 'GET',
        url: `${baseURL}resources/`,
        options: {
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
          },
        },
      },
      functions: {
        getResources: [],
      },
    },
    {
      template: {
        method: 'POST',
        url: `${baseURL}rules/`,
        body: '{body}',
        options: {
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
          },
        },
      },
      functions: {
        createRule: ['body'],
      },
    },
    {
      template: {
        method: 'PUT',
        url: `${baseURL}rules/{id}/`,
        body: '{body}',
        options: {
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
          },
        },
      },
      functions: {
        updateRule: ['id', 'body'],
      },
    },
    {
      template: {
        method: 'DELETE',
        url: `${baseURL}rules/{id}`,
        options: {
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
          },
        },
      },
      functions: {
        deleteRule: ['id'],
      },
    },
  ],
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class RestApiDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = 'restApiEMQX';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.restApiEMQX', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
