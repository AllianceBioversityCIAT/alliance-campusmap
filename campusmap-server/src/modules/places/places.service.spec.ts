import { Test, TestingModule } from '@nestjs/testing';
import { PlacesService } from './places.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Place } from './entities/place.entity';
import { PlacesMapper } from './mappers/places.mapper';

describe('PlacesService', () => {
  let service: PlacesService;
  let repo: jest.Mocked<Partial<Repository<Place>>>;

  beforeEach(async () => {
    repo = {
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlacesService,
        { provide: getRepositoryToken(Place), useValue: repo },
      ],
    }).compile();

    service = module.get<PlacesService>(PlacesService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  it('getAllPlaces llama al repositorio y mapea los resultados', async () => {
    const filas = [{} as Place];
    (repo.find as jest.Mock).mockResolvedValue(filas);

    const mapperSpy = jest
      .spyOn(PlacesMapper, 'toFeatureCollection')
      .mockReturnValue({} as any);

    await service.getAllPlaces();

    expect(repo.find).toHaveBeenCalled();
    expect(mapperSpy).toHaveBeenCalledWith(filas, 'All Places');
  });

  it('getPlacesByTypeCode filtra por código y mapea', async () => {
    const filas = [{} as Place];
    (repo.find as jest.Mock).mockResolvedValue(filas);

    const mapperSpy = jest
      .spyOn(PlacesMapper, 'toFeatureCollection')
      .mockReturnValue({} as any);

    await service.getPlacesByTypeCode('BLDG');

    expect(repo.find).toHaveBeenCalledWith({
      where: { type: { code: 'BLDG' } },
    });
    expect(mapperSpy).toHaveBeenCalledWith(filas, 'Places of type BLDG');
  });
});
