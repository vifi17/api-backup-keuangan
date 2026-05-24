const express = require('express');
const cors = require('cors');
const db = require('../db');

const app = express();

// ========== KONFIGURASI CORS YANG BENAR ==========
// Opsi 1: Izinkan semua origin (untuk development/testing)
app.use(cors({
    origin: '*',  // Izinkan semua domain
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Opsi 2: Izinkan spesifik origin (lebih aman untuk production)
// app.use(cors({
//     origin: ['http://192.168.150.16:5173', 'http://localhost:5173'],
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));

// ========== HANDLE PREFLIGHT REQUEST ==========
// OPTIONS request adalah "preflight" yang dikirim browser sebelum POST
app.options('/backup', cors());  // Handle preflight untuk /backup

// Middleware untuk body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint backup
app.post("/backup", async (req, res) => {
    // Set CORS headers secara manual (backup)
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    
    let pesanx, kodex;
    let nama = req.body.nama_backup;
    let dtx = atob(req.body.dtx);
    let id = Date.now();
    let arr_data = dtx.split("#");
    
    let proses = await db.tambahBackup(id, nama, "nodejs");
    
    if(proses == "1"){
        let berhasil = 0;
        let gagal = 0;
        for(let k of arr_data){
            let arr_data2 = k.split("|");
            let idx = arr_data2[0];
            let deskripsix = arr_data2[1];
            let waktux = arr_data2[2];
            let nominalx = arr_data2[3];
            let jenisx = arr_data2[4];
            let proses2 = await db.tambahTransaksi(`${id}-${idx}`, id, waktux, nominalx, jenisx, deskripsix);
            proses2 == "1" ? berhasil++ : gagal++;
        }
        pesanx = {kode: "01", status: "Proses Backup Berhasil", berhasil: berhasil, gagal: gagal};
        kodex = 200;
    } else {
        pesanx = {kode: "00", status: "Proses Backup Gagal"};
        kodex = 500;
    }
    return res.status(kodex).json(pesanx);
});

// Ekspor untuk Vercel
module.exports = app;