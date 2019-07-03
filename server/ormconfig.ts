import { ConnectionOptions } from "typeorm";

const connectionOptions:ConnectionOptions = {
  type: "postgres",
  database: "test_db",
  synchronize: true,
  port: 5432,
  host: "localhost",
  username: "postgres",
  password:  "",
  migrationsTableName: "my_migration_table",
  entities: ["entity/*.ts"],
  migrations: ["migration/**/*.ts"],
  subscribers: ["subscriber/**/*.ts"],
  cli: {
    entitiesDir: "entity",
    migrationsDir: "migration"
  }
};

export default connectionOptions;