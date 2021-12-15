import {repository} from '@loopback/repository';
import {get, param, response} from '@loopback/rest';
import {Device, Element} from '../models';
import {
  Co2Repository,
  DeviceRepository,
  ElementRepository,
  HumidityRepository,
  TemperatureRepository,
} from '../repositories';

export class GenerateDataController {
  constructor(
    @repository(DeviceRepository)
    public deviceRepository: DeviceRepository,
    @repository(TemperatureRepository)
    public temperatureRepository: TemperatureRepository,

    @repository(HumidityRepository)
    public humidityRepository: HumidityRepository,

    @repository(Co2Repository)
    public co2Repository: Co2Repository,

    @repository(ElementRepository)
    public elementRepository: ElementRepository,
  ) {}

  @get('/generate/devices')
  @response(200, {
    description: 'Device model instance',
  })
  async generateDevices(): Promise<void> {
    for (let index = 0; index < 5; index++) {
      let deviceId = (Math.random() + 1)
        .toString(36)
        .substring(7)
        .toUpperCase();
      const name = `Device ${index + 1}`.toUpperCase();

      await this.deviceRepository.create({
        code: deviceId,
        name,
      });
    }
  }

  async generateTemperature(device: string): Promise<void> {
    for (let indexM = 1; indexM <= 11; indexM++) {
      const days = new Date(2021, indexM, 0).getDate();

      for (let indexD = 1; indexD <= days; indexD++) {
        const day = indexD;

        for (let indexH = 0; indexH < 24; indexH++) {
          for (const min of [0, 15, 30, 45]) {
            const value: number = parseFloat(
              (Math.random() * (40 - -4) + -4).toFixed(2),
            );
            const date = new Date(2021, indexM - 1, day, indexH, min);
            await this.temperatureRepository.create({
              value,
              date: date.toISOString(),
              deviceId: device,
            });
          }
        }
      }
    }
  }

  async generateDataHumidity(device: string): Promise<void> {
    for (let indexM = 1; indexM <= 11; indexM++) {
      const days = new Date(2021, indexM, 0).getDate();

      for (let indexD = 1; indexD <= days; indexD++) {
        const day = indexD;

        for (let indexH = 0; indexH < 24; indexH++) {
          for (const min of [0, 15, 30, 45]) {
            const value: number = parseFloat(
              (Math.random() * (100 - 10) + 10).toFixed(2),
            );
            const date = new Date(2021, indexM - 1, day, indexH, min);
            this.humidityRepository.create({
              value,
              date: date.toISOString(),
              deviceId: device,
            });
          }
        }
      }
    }
  }

  async generateDataCo2(device: string): Promise<void> {
    for (let indexM = 1; indexM <= 11; indexM++) {
      const days = new Date(2021, indexM, 0).getDate();

      for (let indexD = 1; indexD <= days; indexD++) {
        const day = indexD;

        for (let indexH = 0; indexH < 24; indexH++) {
          for (const min of [0, 15, 30, 45]) {
            const value: number = parseFloat(
              (Math.random() * (2500 - 0) + 0).toFixed(2),
            );
            const date = new Date(2021, indexM - 1, day, indexH, min);
            this.co2Repository.create({
              value,
              date: date.toISOString(),
              deviceId: device,
            });
          }
        }
      }
    }
  }

  @get('/generate/history/')
  @response(200, {
    description: 'Generate data history of Temperature, Humidity and CO2',
  })
  async find(@param.query.string('element') element?: string): Promise<any> {
    const elements: Element[] = await this.elementRepository.find();

    const devices: Device[] | any[] = await this.deviceRepository.find({
      include: [{relation: 'sensorModel'}],
      where: {deleted: {neq: true}},
    });

    for (let index = 0; index < devices.length; index++) {
      const device: any = devices[index];

      devices[index].sensorModel.elements = [];
      for (let i = 0; i < devices[index].sensorModel.elementIds.length; i++) {
        const e: Element =
          elements.find(
            x => x.id == devices[index].sensorModel.elementIds[i],
          ) || new Element();

        devices[index].sensorModel.elements?.push(e);
      }
      if (
        devices[index].sensorModel.elements?.some(
          (x: any) => x.name === element,
        )
      ) {
        switch (element) {
          case 'TEMPERATURE':
            this.generateTemperature(device.id);
            break;
          case 'HUMIDITY':
            this.generateDataHumidity(device.id);
            break;
          case 'CO2':
            this.generateDataCo2(device.id);
            break;

          default:
            break;
        }
      }
    }

    return devices;
  }
}
