import "reflect-metadata"
import { DataSource } from "typeorm"
import { Notificationjob } from "./entity/Notificationjob"

export const AppDataSource = new DataSource({
    type: "mysql", // Specify database type as MySQL
    host: process.env.DB_HOST, // Get host from environment variables
    port: parseInt(process.env.DB_PORT || '3306', 10), // Get port, convert to number
    username: process.env.DB_USERNAME, // Get username
    password: process.env.DB_PASSWORD, // Get password
    database: process.env.DB_DATABASE, // Get database name
    synchronize: false, // Auto-create database schema on application start (FOR DEVELOPMENT ONLY!)
    logging: false, // Set to true to see SQL queries in console
    entities: ["src/entity/Notificationjob.ts"], // Path to your entity files
    migrations: [], // You can add migration files here later for production
    subscribers: [], // For TypeORM subscribers
});
