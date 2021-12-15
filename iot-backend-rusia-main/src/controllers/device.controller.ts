import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/context';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {
  add,
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
  sub,
} from 'date-fns';
import {
  Co2,
  Device,
  Element as el,
  Element,
  Humidity,
  Rule,
  SensorModel,
  Temperature,
} from '../models';
import {
  DeviceRepository,
  ElementRepository,
  RuleRepository,
  SensorModelRepository,
} from '../repositories';
import {RestApiEMQX} from '../services';

@authenticate('jwt')
export class DeviceController {
  constructor(
    @repository(DeviceRepository)
    public deviceRepository: DeviceRepository,
    @repository(ElementRepository)
    public elementRepository: ElementRepository,
    @repository(SensorModelRepository)
    public sensorModelRepository: SensorModelRepository,
    @repository(RuleRepository)
    public ruleRepository: RuleRepository,
    @inject('services.RestApiEMQX')
    protected emqxService: RestApiEMQX,
  ) {
    this.getResources();
  }

  async getResources() {
    console.log(await this.emqxService.getResources());
  }

  //==========================================================================
  //
  //  #####    ##   ##  ##      #####   ####
  //  ##  ##   ##   ##  ##      ##     ##
  //  #####    ##   ##  ##      #####   ###
  //  ##  ##   ##   ##  ##      ##        ##
  //  ##   ##   #####   ######  #####  ####
  //
  //==========================================================================

  async createRuleToSaveData(
    greenhousesId: string,
    deviceId: string,
    elementId: string,
    path: string,
  ) {
    const topic = `${greenhousesId}/${deviceId}/${elementId}/save`;
    const rawsql = `SELECT payload.value as value FROM "${topic}" WHERE is_num(value)`;
    const newRule = {
      rawsql,
      enabled: true,
      actions: [
        {
          name: 'data_to_webserver',
          params: {
            path,
            $resource: 'resource:895012', //,'resource:698326',
            body: `{"value":${'${value}'},"deviceId":"${deviceId}"}`,
          },
        },
      ],
    };

    try {
      const saveRule: any = await this.emqxService.createRule(newRule);
      console.log(saveRule);

      await this.ruleRepository.create({
        rawsql,
        topic,
        deviceId,
        enabled: newRule.enabled,
        ruleIdEmqx: saveRule.data.id,
        elementId,
        actions: JSON.stringify(newRule.actions),
        path,
      });
    } catch (error) {
      console.log(error);
    }
  }
  async updateRuleToSaveData(
    greenhousesId: string,
    deviceId: string,
    elementId: string,
    path: string,
    rule: Rule,
  ) {
    const topic = `${greenhousesId}/${deviceId}/${elementId}/save`;
    const rawsql = `SELECT payload.value as value FROM "${topic}" WHERE is_num(value)`;

    const newRule = {
      rawsql,
      enabled: rule.enabled,
      actions: [
        {
          name: 'data_to_webserver',
          params: {
            path,
            $resource: 'resource:698326',
            body: `{"value":${'${value}'},"deviceId":"${deviceId}"}`,
          },
        },
      ],
    };

    try {
      const saveRule: any = await this.emqxService.updateRule(
        rule.ruleIdEmqx,
        newRule,
      );

      await this.ruleRepository.updateById(rule.id, {
        rawsql,
        topic,
        deviceId,
        enabled: newRule.enabled,
        ruleIdEmqx: saveRule.data.id,
        elementId,
        actions: JSON.stringify(newRule.actions),
        path,
      });
    } catch (_) {}
  }

  //=======================================================
  //
  //    ###    #####   ##
  //   ## ##   ##  ##  ##
  //  ##   ##  #####   ##
  //  #######  ##      ##
  //  ##   ##  ##      ##
  //
  //=======================================================

  @post('/devices')
  @response(200, {
    description: 'Device model instance',
    content: {'application/json': {schema: getModelSchemaRef(Device)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Device, {
            title: 'NewDevice',
            exclude: ['id'],
          }),
        },
      },
    })
    device: Omit<Device, 'id'>,
  ): Promise<Device> {
    const save: Device = await this.deviceRepository.create({...device});

    const sensor: SensorModel = await this.sensorModelRepository.findById(
      device.sensorModelId,
    );

    const elements: Element[] = await this.elementRepository.find();

    try {
      for (let index = 0; index < sensor.elementIds.length; index++) {
        const elementId = sensor.elementIds[index];
        const element: Element | any = elements.find(x => x.id === elementId);
        let path = '';
        switch (element?.name) {
          case 'TEMPERATURE':
            path = '/temperatures';
            break;
          case 'HUMIDITY':
            path = '/humidities';
            break;
          case 'CO2':
            path = '/co2s';
            break;
          default:
            break;
        }
        await this.createRuleToSaveData(
          device.greenhouseId,
          save.id ?? 'undefined',
          elementId,
          path,
        );
      }
    } catch (e) {
      console.log(e);
    }

    return save;
  }

  @get('/devices')
  @response(200, {
    description: 'Array of Device model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Device, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Device) filter?: Filter<Device>,
    @param.query.string('search') search?: string,
    @param.query.string('greenhouseId') greenhouseId?: string,
  ): Promise<{results: Device[]; count: Number}> {
    let where: any = {
      deleted: {
        neq: true,
      },
    };

    let _search: any = search ? new RegExp(search, 'i') : '';
    if (search && greenhouseId) {
      where = {
        ...where,
        or: [
          {code: {like: _search || ''}},
          {name: {like: _search || ''}},
          {greenhouseId},
        ],
      };
    } else if (search) {
      where = {
        ...where,
        or: [{code: {like: _search || ''}}, {name: {like: _search || ''}}],
      };
    } else if (greenhouseId) {
      where = {
        ...where,
        greenhouseId,
      };
    }

    const results: Device[] | any[] = await this.deviceRepository.find({
      ...filter,
      where,
      include: [
        {relation: 'sensorModel'},
        {relation: 'rules'},
        {
          relation: 'greenhouse',
          scope: {
            include: [{relation: 'location'}],
          },
        },
      ],
    });

    for (let index = 0; index < results.length; index++) {
      results[index].sensorModel.elements = [];
      for (let i = 0; i < results[index].sensorModel.elementIds.length; i++) {
        const e: el = await this.elementRepository.findById(
          results[index].sensorModel.elementIds[i],
        );
        results[index].sensorModel.elements?.push(e);
      }
    }

    return {
      results,
      count: (
        await this.deviceRepository.count({
          ...where,
        })
      ).count,
    };
  }

  getDateRange(
    period: string,
    date: string,
  ): {
    init: string | any;
    end: string | any;
  } {
    const temp = new Date();
    const now = new Date(temp.getFullYear(), temp.getMonth(), temp.getDate());

    switch (period) {
      case 'today':
        return {init: now, end: add(now, {days: 1})};
      case 'last24':
        return {init: sub(temp, {hours: 24}), end: temp};
      case 'yesterday':
        return {init: sub(now, {days: 1}), end: now};
      case 'current_week':
        const weekEnd = endOfWeek(now, {weekStartsOn: 0});
        return {init: sub(weekEnd, {weeks: 1}), end: weekEnd};
      case 'last_week':
        const weekStart = startOfWeek(now, {weekStartsOn: 0});
        return {init: sub(weekStart, {weeks: 1}), end: weekStart};
      case 'current_month':
        return {init: startOfMonth(now), end: endOfMonth(now)};
      case 'last_month':
        const monthStart = startOfMonth(now);
        return {init: sub(monthStart, {months: 1}), end: monthStart};
      case 'month':
        const [y, m] = date.split('-');
        const newMonth = new Date(parseInt(y), parseInt(m) - 1, 1);
        return {init: newMonth, end: endOfMonth(newMonth)};
      case 'date':
        const [y1, m1, d] = date.split('-');
        const newDate = new Date(parseInt(y1), parseInt(m1) - 1, parseInt(d));
        return {init: newDate, end: add(newDate, {days: 1})};
      default:
        return {init: '', end: ''};
    }
  }

  @get('/devices-temperature/')
  @response(200, {
    description: 'Array of Device model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Device, {includeRelations: true}),
        },
      },
    },
  })
  async findDeviceTemp(
    @param.query.string('device') id: string,
    @param.query.string('period') period: string,
    @param.query.string('date') date: string,
    @param.filter(Temperature) filter?: Filter<Device>,
  ): Promise<Temperature[]> {
    const {init, end} = this.getDateRange(period, date);

    return this.deviceRepository
      .findById(id, {
        include: [
          {
            relation: 'temperatures',
            scope: {
              ...filter,
              order: ['date ASC'],
              where: {
                and: [
                  {
                    date: {
                      gte: init,
                    },
                  },
                  {
                    date: {
                      lt: end,
                    },
                  },
                ],
              },
            },
          },
        ],
      })
      .then(x => x.temperatures || [])
      .catch(() => []);
  }

  @get('/devices-humidity/')
  @response(200, {
    description: 'Array of Device model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Device, {includeRelations: true}),
        },
      },
    },
  })
  async findDeviceHum(
    @param.query.string('device') id: string,
    @param.query.string('period') period: string,
    @param.query.string('date') date: string,
    @param.filter(Humidity) filter?: Filter<Device>,
  ): Promise<Humidity[]> {
    const {init, end} = this.getDateRange(period, date);

    return this.deviceRepository
      .findById(id, {
        include: [
          {
            relation: 'humidities',
            scope: {
              ...filter,
              order: ['date ASC'],
              where: {
                and: [
                  {
                    date: {
                      gte: init,
                    },
                  },
                  {
                    date: {
                      lt: end,
                    },
                  },
                ],
              },
            },
          },
        ],
      })
      .then(x => x.humidities || [])
      .catch(x => []);
  }

  @get('/devices-co2/')
  @response(200, {
    description: 'Array of Device model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Device, {includeRelations: true}),
        },
      },
    },
  })
  async findDeviceCo2(
    @param.query.string('device') id: string,
    @param.query.string('period') period: string,
    @param.query.string('date') date: string,
    @param.filter(Co2) filter?: Filter<Device>,
  ): Promise<Co2[]> {
    const {init, end} = this.getDateRange(period, date);

    return this.deviceRepository
      .findById(id, {
        include: [
          {
            relation: 'co2s',
            scope: {
              ...filter,
              order: ['date ASC'],
              where: {
                and: [
                  {
                    date: {
                      gte: init,
                    },
                  },
                  {
                    date: {
                      lt: end,
                    },
                  },
                ],
              },
            },
          },
        ],
      })
      .then(x => x.co2s || [])
      .catch(x => []);
  }
  @patch('/devices')
  @response(200, {
    description: 'Device PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Device, {partial: true}),
        },
      },
    })
    device: Device,
    @param.where(Device) where?: Where<Device>,
  ): Promise<Count> {
    return this.deviceRepository.updateAll(device, where);
  }

  @get('/devices/{id}')
  @response(200, {
    description: 'Device model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Device, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Device, {exclude: 'where'})
    filter?: FilterExcludingWhere<Device>,
  ): Promise<Device> {
    return this.deviceRepository.findById(id, filter);
  }

  @patch('/devices/{id}')
  @response(204, {
    description: 'Device PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Device, {partial: true}),
        },
      },
    })
    device: Device,
  ): Promise<void> {
    await this.deviceRepository.updateById(id, device);
  }

  @put('/devices/{id}')
  @response(204, {
    description: 'Device PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() device: Device,
  ): Promise<any> {
    const findDevice: Device = await this.deviceRepository.findById(id, {
      include: [{relation: 'rules'}],
    });

    await this.deviceRepository.updateById(id, {...device});

    if (findDevice.sensorModelId == device.sensorModelId) {
      if (findDevice.greenhouseId != device.greenhouseId) {
        for (let index = 0; index < findDevice.rules.length; index++) {
          const rule = findDevice.rules[index];
          this.updateRuleToSaveData(
            device.greenhouseId,
            id || '',
            rule.elementId || '',
            rule.path || '',
            rule,
          );
        }
      }

      return;
    }

    console.log('CREATE AGAIN');

    if (findDevice.rules) {
      for (let index = 0; index < findDevice.rules.length; index++) {
        const rule = findDevice.rules[index];
        this.emqxService.deleteRule(rule.ruleIdEmqx);
        this.ruleRepository.deleteById(rule.id);
      }
    }
    const sensor: SensorModel = await this.sensorModelRepository.findById(
      device.sensorModelId,
    );

    const elements: Element[] = await this.elementRepository.find();

    try {
      for (let index = 0; index < sensor.elementIds.length; index++) {
        const elementId = sensor.elementIds[index];
        const element: Element | any = elements.find(x => x.id === elementId);
        let path = '';
        switch (element?.name) {
          case 'TEMPERATURE':
            path = '/temperatures';
            break;
          case 'HUMIDITY':
            path = '/humidities';
            break;
          case 'CO2':
            path = '/co2s';
            break;
          default:
            break;
        }
        await this.createRuleToSaveData(
          device.greenhouseId,
          id ?? 'undefined',
          elementId,
          path,
        );
      }
    } catch (_) {}
  }

  @del('/devices/{id}')
  @response(204, {
    description: 'Device DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    const device: Device = await this.deviceRepository.findById(id, {
      include: [{relation: 'rules'}],
    });

    for (let index = 0; index < device.rules.length; index++) {
      const rule = device.rules[index];

      await this.emqxService.deleteRule(rule.ruleIdEmqx);
    }
    await this.deviceRepository.updateById(id, {
      deleted: true,
      name: `DELETED ${device.name}`,
    });
  }
}
