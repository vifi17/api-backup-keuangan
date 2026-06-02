// const express = require("express");
// const cors = require("cors");
// const db = require("../db.js");

// const app = express();

// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));


// app.get("/status", (req, res) => {
//     res.status(200).json({
//         kode: "01",
//         status: "API Berbasis ExpressJS OK"
//     });
// });

// app.post("/backup", async (req, res) => {
//     try {
//         let pesanx, kodex;
//         const nama = req.body.nama_backup;
//         const dtx = Buffer.from(req.body.dtx, 'base64').toString('utf-8');
//         const id = Date.now();
//         const arr_data = dtx.split("#");
//         const proses = await db.tambahBackup(id, nama, "nodejs");
//         if (proses == "1") {
//             let berhasil = 0;
//             let gagal = 0;
//             for (const k of arr_data) {
//                 if (!k) continue;
//                 const arr_data2 = k.split("|");
//                 const idx = arr_data2[0];
//                 const deskripsix = arr_data2[1];
//                 const waktux = arr_data2[2];
//                 const nominalx = arr_data2[3];
//                 const jenisx = arr_data2[4];
//                 const proses2 = await db.tambahTransaksi( `${id}-${idx}`, id, waktux, nominalx, jenisx, deskripsix);
//                 proses2 == "1" ? berhasil++ : gagal++;
//             }
//             pesanx = {
//                 kode: "01",
//                 status: "Proses Backup Berhasil",
//                 berhasil: berhasil,
//                 gagal: gagal
//             };
//             kodex = 200;
//         } else {
//             pesanx = {
//                 kode: "00",
//                 status: "Proses Backup Gagal"
//             };
//             kodex = 500;
//         }
//         return res.status(kodex).json(pesanx);
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             kode: "00",
//             status: "Terjadi Error Server",
//             error: error.message
//         });
//     }
// });

// module.exports = app;
const express = require("express");
const cors = require("cors");
const db = require("../db.js");

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
    res.send("API NORMAL");
});

app.post("/backup", (req, res) => {

    console.log(req.body);

    res.json({
        success: true,
        data: req.body
    });

});

app.get("/buat-table", (req, res) => {

    db.query(`
        CREATE TABLE IF NOT EXISTS backup (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nama_backup VARCHAR(255)
        )
    `, (err, result) => {

        if(err){

            console.log("ERROR SQL:");
            console.log(err);

            return res.status(500).json({
                success: false,
                message: err.message,
                error: err
            });

        }

        res.json({
            success: true,
            message: "Tabel berhasil dibuat"
        });

    });

});

db.connect((err) => {

    if(err){
        console.log("DATABASE ERROR");
        console.log(err);
    } else {
        console.log("DATABASE CONNECTED");
    }

});

module.exports = app;