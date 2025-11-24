// places.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { PlacesController } from './places.controller';
import { PlacesService } from './places.service';

describe('PlacesController', () => {
  let controller: PlacesController;

  const serviceMock = {
    getAllPlaces: jest.fn(),
    getPlacesByTypeCode: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlacesController],
      providers: [{ provide: PlacesService, useValue: serviceMock }],
    }).compile();

    controller = module.get<PlacesController>(PlacesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getAllPlaces delegates to service', async () => {
    serviceMock.getAllPlaces.mockResolvedValue('ok');
    await controller.getAllPlaces();
    expect(serviceMock.getAllPlaces).toHaveBeenCalled();
  });

  it('getPlacesByType delegates to service', async () => {
    serviceMock.getPlacesByTypeCode.mockResolvedValue('ok');
    await controller.getPlacesByType('BLDG');
    expect(serviceMock.getPlacesByTypeCode).toHaveBeenCalledWith('BLDG');
  });

  it('getAllPlaces with search term delegates to service', async () => {
    serviceMock.getAllPlaces.mockResolvedValue('ok');
    await controller.getAllPlaces('test');
    expect(serviceMock.getAllPlaces).toHaveBeenCalledWith('test');
  });
});
