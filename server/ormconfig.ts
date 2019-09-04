import { ConnectionOptions } from "typeorm";

const connectionOptions: ConnectionOptions = {
  type: "postgres",
  database: "postgres",
  synchronize: true,
  port: 5432,
  host: "db",
  username: "postgres",
  password: "",
  migrationsTableName: "my_migration_table",
  entities: [__dirname + "/entity/*.*"],
  migrations: ["migration/**/*.ts"],
  subscribers: ["subscriber/**/*.ts"],
  cli: {
    entitiesDir: "entity",
    migrationsDir: "migration"
  }
};

export default connectionOptions;
