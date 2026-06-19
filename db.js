require('dotenv').config();

const mysql = require('mysql2/promise');

let sql;

const buatKoneksi = async () => {

    return await mysql.createConnection({
        host: process.env.MYSQLHOST,
        user: process.env.MYSQLUSER,
        password: process.env.MYSQLPASSWORD,
        database: process.env.MYSQLDATABASE,
        port: process.env.MYSQLPORT,

        ssl: {
            rejectUnauthorized: false
        }
    });

};

const tambahBackup = async (id, nama, channel) => {
    const db = await buatKoneksi();
    sql = `
        INSERT INTO backup
        VALUES('${id}','${nama}','${channel}',NOW())
    `;
    try {
        await db.execute(sql);
        await db.end();
        return "1";
    } catch(err){
        console.log(err);
        console.log("ERROR TAMBAH TRANSAKSI");
        return "0";
    }
};

const tambahTransaksi = async (
    idx,id,waktux,nominalx,jenisx,deskripsix) => {
    const db = await buatKoneksi();
    sql = `
        INSERT INTO backup_transaksi
        VALUES(
            '${idx}',
            '${id}',
            '${waktux}',
            '${nominalx}',
            '${jenisx}',
            '${deskripsix}'
        )
    `;
    try {
        await db.execute(sql);
        await db.end();
        return "1";
    } catch(err){
        console.log(arr_data2);
        console.log(err);
        console.log("ERROR TAMBAH BACKUP");
        return "0";
    }
};

const bacaBackup = async () => {
    const db = await buatKoneksi();
    sql = `SELECT * FROM backup ORDER BY waktu DESC`;
    const [rows] = await db.execute(sql);
    return rows.length > 0 ? rows : false;
};

const bacaDetailBackup = async (id_backup) => {
    const db = await buatKoneksi();
    sql = `SELECT * FROM backup_transaksi WHERE id = '${id_backup}'ORDER BY tgl_jam`;
    const [rows] = await db.execute(sql);
    await db.end();
    return rows.length > 0 ? rows : false;
}

module.exports = {
    buatKoneksi,
    tambahBackup,
    tambahTransaksi,
    bacaBackup,
    bacaDetailBackup
};
console.log(process.env.MYSQLHOST);