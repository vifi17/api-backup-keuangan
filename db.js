require('dotenv').config();
const mysql = require('mysql2/promise');
let sql;
const buatKoneksi = mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT
    });
const tambahBackup = async (id, nama, channel) => {
    const db = await buatKoneksi();
    sql = `INSERT INTO backup VALUES('${id}','${nama}','${channel}',NOW())`;
    try{
        await db.execute(sql);
        await db.end();
        return "1";
    }catch(err){
        return "0";
    }
};
const tambahTransaksi = async (idx, id, waktux, nominalx, jenisx, deskripsix) => {
    const db = await buatKoneksi();
    sql = `INSERT INTO backup_transaksi VALUES('${idx}','${id}','${waktux}','${nominalx}','${jenisx}','${deskripsix}')`;
    try{
       await db.execute(sql);
       await db.end();
       return "1"; 
    }catch(err){
        return "0";
    }
};
module.exports = {buatKoneksi, tambahBackup, tambahTransaksi}