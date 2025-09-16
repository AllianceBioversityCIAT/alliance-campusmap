import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';

type BooleanLike = string | undefined | null;

const DEFAULT_DB_PORT = 5432;

const toBoolean = (value: BooleanLike): boolean => {
  return (
    value !== undefined && value !== null && value.toLowerCase() === 'true'
  );
};

const buildSslConfig = () => {
  if (!toBoolean(process.env.DB_SSL)) {
    return undefined;
  }

  const rejectEnv = process.env.DB_SSL_REJECT_UNAUTHORIZED;
  const rejectUnauthorized =
    rejectEnv === undefined ? false : rejectEnv.toLowerCase() === 'true';

  return { rejectUnauthorized };
};

export const buildTypeOrmOptions = (): TypeOrmModuleOptions => {
  const baseConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    autoLoadEntities: true,
    synchronize: toBoolean(process.env.DB_SYNCHRONIZE),
    logging: toBoolean(process.env.DB_LOGGING),
  };

  if (process.env.DATABASE_URL) {
    return {
      ...baseConfig,
      url: process.env.DATABASE_URL,
      ssl: buildSslConfig(),
    };
  }

  const database = process.env.DB_NAME ?? 'campusmap';
  const port = Number.parseInt(process.env.DB_PORT ?? '', 10);

  return {
    ...baseConfig,
    host: process.env.DB_HOST ?? 'localhost',
    port: Number.isNaN(port) ? DEFAULT_DB_PORT : port,
    username: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD ?? undefined,
    database,
    ssl: buildSslConfig(),
  };
};

export const buildDataSourceOptions = (): DataSourceOptions => {
  const { autoLoadEntities, ...rest } = buildTypeOrmOptions();
  void autoLoadEntities;
  return rest as DataSourceOptions;
};

export const AppDataSource = new DataSource(buildDataSourceOptions());
