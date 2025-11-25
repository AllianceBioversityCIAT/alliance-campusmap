import { Test, TestingModule } from '@nestjs/testing';
import { SitesService } from './sites.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Site } from './entities/site.entity';

describe('SitesService', () => {
  let service: SitesService;
  let repo: jest.Mocked<Partial<Repository<Site>>>;

  beforeEach(async () => {
    repo = {
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SitesService,
        { provide: getRepositoryToken(Site), useValue: repo },
      ],
    }).compile();

    service = module.get<SitesService>(SitesService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getAllSites calls repository with relations', async () => {
    const sites = [{} as Site];
    (repo.find as jest.Mock).mockResolvedValue(sites);

    const result = await service.getAllSites();

    expect(repo.find).toHaveBeenCalledWith({
      relations: ['place', 'type'],
    });
    expect(result).toEqual(sites);
  });

  it('getSiteByTypeCode filters by code and includes relations', async () => {
    const sites = [{} as Site];
    (repo.find as jest.Mock).mockResolvedValue(sites);

    const result = await service.getSiteByTypeCode('park');

    expect(repo.find).toHaveBeenCalledWith({
      where: { type: { code: 'park' } },
      relations: ['place', 'type'],
    });
    expect(result).toEqual(sites);
  });
});
