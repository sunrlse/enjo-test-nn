const mysql = require('mysql');
const config = {
    "connectionLimit": 10,
    "host": "localhost",
    "user": "root",
    "password": "enjo123",
    "database": "mydoc"
}

const pool = mysql.createPool(config);

let execSQL = (sql, logger) => {
    return new Promise((resolve, reject) => {
        let s_time = +new Date();
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err)
            } else {
                connection.query(sql, (err, rows) => {
                    // logger.info(sql, `数据库查询耗时: ${+new Date() - s_time}ms`);
                    console.log('-------------------------------')
                    console.log('sqled ', err, rows)
                    console.log('-------------------------------')
                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                    connection.release()
                })
            }
        })
    })
};

module.exports = {
    execSQL,
    escape: pool.escape
}
