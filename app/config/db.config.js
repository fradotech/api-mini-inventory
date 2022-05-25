module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    timezone: '+07:00',
    dialectOptions: {
      bigNumberStrings: true,
    },
    define: {
      freezeTableName: 1,
      underscored: true,
      underscoredAll: true,
      created_at: 'created_at',
      updated_at: 'updated_at',
    },
  },
  production: {
    username: 'jcovbsesaatujy',
    password: 'a0b37382619592052f7f3d939be45d9281ad4848fb36b89a32c04b39a178505c',
    database: 'derqhqjo3hoc7u',
    host: 'ec2-34-201-95-176.compute-1.amazonaws.com',
    port: 5432,
    dialect: 'postgres',
    timezone: '+07:00',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    define: {
      freezeTableName: 1,
      underscored: true,
      underscoredAll: true,
      created_at: 'created_at',
      updated_at: 'updated_at',
    },
  },
}
