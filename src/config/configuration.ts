interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
}

export default (): { port: number; database: DatabaseConfig } => {
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const dbPort = process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT, 10) : 3306;
  
  return {
    port,
    database: {
      host: process.env.DATABASE_HOST || 'localhost',
      port: dbPort,
      username: process.env.DATABASE_USERNAME || 'root',
      password: process.env.DATABASE_PASSWORD || 'password',
      database: process.env.DATABASE_NAME || 'nest_db',
      synchronize: process.env.NODE_ENV !== 'production',
    },
  };
};
