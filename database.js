const sql = require('mssql');
const dotenv = require('dotenv');

dotenv.config();

const config = {
    user: process.env.MY_SQL_USER,
    password: process.env.MY_SQL_PASSWORD,
    server: process.env.MY_SQL_HOST,
    database: process.env.MY_SQL_DATABASE,
    port: parseInt(process.env.MY_SQL_PORT) || 1433,
    options: {
        encrypt: true, // Azure SQL requires encryption
        trustServerCertificate: false
    }
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log("✅ Connected to Azure SQL Database");
        return pool;
    })
    .catch(err => {
        console.error("❌ Database connection failed:", err);
        process.exit(1);
    });

const ensureTableExists = async () => {
    try {
        const pool = await poolPromise;
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='schools' AND xtype='U')
            CREATE TABLE schools (
                id INT IDENTITY(1,1) PRIMARY KEY,
                name NVARCHAR(255) NOT NULL,
                address NVARCHAR(500) NOT NULL,
                latitude FLOAT NOT NULL,
                longitude FLOAT NOT NULL
            )
        `);
        console.log("✅ Ensured 'schools' table exists");
    } catch (err) {
        console.error("❌ Error ensuring table:", err);
    }
};

const addSchool = async (name, address, latitude, longitude) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('name', sql.NVarChar, name)
            .input('address', sql.NVarChar, address)
            .input('latitude', sql.Float, latitude)
            .input('longitude', sql.Float, longitude)
            .query('INSERT INTO schools (name, address, latitude, longitude) VALUES (@name, @address, @latitude, @longitude)');
        
        console.log("✅ School added successfully:", result.rowsAffected);
        return result;
    } catch (err) {
        console.error("❌ Error inserting school:", err);
        throw err;
    }
};

const getSchools = async () => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM schools');
        console.log("✅ Fetched Schools:", result.recordset.length);
        return result.recordset;
    } catch (err) {
        console.error("❌ Error fetching schools:", err);
        throw err;
    }
};

ensureTableExists();

module.exports = { sql, poolPromise, addSchool, getSchools };
