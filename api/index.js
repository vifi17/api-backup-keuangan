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


// module.exports = app;
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API NORMAL");
});
app.post("/backup", async (req, res) => {

    try {

        let pesanx, kodex;

        let nama = req.body.nama_backup;

        let dtx = Buffer.from(req.body.dtx, 'base64').toString('utf-8');

        let id = Date.now();

        let arr_data = dtx.split("#");

        let proses = await db.tambahBackup(id, nama, "nodejs");

        if(proses == "1"){

            let berhasil = 0;
            let gagal = 0;

            for(let k of arr_data){

                if (!k) continue;

                let arr_data2 = k.split("|");

                let idx = arr_data2[0];
                let deskripsix = arr_data2[1];
                let waktux = arr_data2[2];
                let nominalx = arr_data2[3];
                let jenisx = arr_data2[4];

                let proses2 = await db.tambahTransaksi(
                    `${id}-${idx}`,
                    id,
                    waktux,
                    nominalx,
                    jenisx,
                    deskripsix
                );

                proses2 == "1"
                    ? berhasil++
                    : gagal++;

            }

            pesanx = {
                kode: "01",
                status: "Proses Backup Berhasil",
                berhasil: berhasil,
                gagal: gagal
            };

            kodex = 200;

        } else {

            pesanx = {
                kode: "00",
                status: "Proses Backup Gagal"
            };

            kodex = 500;

        }

        return res.status(kodex).json(pesanx);

    } catch(error){

        console.log(error);

        return res.status(500).json({
            error: error.message
        });

    }

});

module.exports = app;