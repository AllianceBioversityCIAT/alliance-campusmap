import { Test, TestingModule } from '@nestjs/testing';
import { SitesController } from './sites.controller';
import { SitesService } from './sites.service';

describe('SitesController', () => {
  let controller: SitesController;

  const serviceMock = {
    getAllSites: jest.fn(),
    getSiteByTypeCode: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SitesController],
      providers: [{ provide: SitesService, useValue: serviceMock }],
    }).compile();

    controller = module.get<SitesController>(SitesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getAllSites delegates to service', async () => {
    serviceMock.getAllSites.mockResolvedValue([]);

    const result = await controller.getAllSites();

    expect(serviceMock.getAllSites).toHaveBeenCalled();
    expect(result).toEqual({
      type: 'FeatureCollection',
      name: 'All Sites',
      features: [],
    });
  });

  it('getSitesByTypeCode delegates to service', async () => {
    serviceMock.getSiteByTypeCode.mockResolvedValue([]);

    const result = await controller.getSitesByTypeCode('assembly_point');

    expect(serviceMock.getSiteByTypeCode).toHaveBeenCalledWith(
      'assembly_point',
    );
    expect(result.features).toEqual([]);
  });
});
