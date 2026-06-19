const express = require("express");
const cors = require("cors");
const db = require("../db.js");
const Pusher =require("pusher");

const app = express();

app.use(cors());
app.use(express.json());

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_APP_KEY,
    secret: process.env.PUSHER_APP_SECRET,
    cluster: process.env.PUSHER_APP_CLUSTER,
    useTLS: true
});

async function kirimRealtime(data) {
    try {

        console.log("Mengirim realtime:", data);

        await pusher.trigger(
            "backup-channel",
            "backup.event",
            {
                data: data
            }
        );

        console.log("Realtime berhasil dikirim");

    } catch (err) {

        console.log("Gagal kirim realtime:", err);

    }
}

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
                let uraian = arr_data2[1];
                let tgl_jam = arr_data2[2];
                let nominal = arr_data2[3];
                let jenis = arr_data2[4];
                let proses2 = await db.tambahTransaksi(
                    `${id}-${idx}`,
                    id,
                    tgl_jam,
                    nominal,
                    jenis,
                    uraian
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
            await kirimRealtime({
                source: "nodejs",
                backup_id: id,
                nama_backup: nama,
                status: "success",
                berhasil: berhasil,
                gagal: gagal,
                total_data: arr_data.length,
                waktu: new Date().toISOString()
            });
            kodex = 200;
        } else {
            pesanx = {
                kode: "00",
                status: "Proses Backup Gagal"
            };
            await kirimRealtime({
                source: "nodejs",
                backup_id: id,
                nama_backup: nama,
                status: "failed",
                berhasil: 0,
                gagal: 0,
                total_data: 0,
                waktu: new Date().toISOString()
            });
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

app.get("/daftar_backup", async (req,res) => {
    const dtbackup = await db.bacaBackup();
    if(dtbackup == false){
        res.send('{"kode":"00","pesan":"Data Backup Tidak Di Temukan"}');
    }else{
        res.send('{"kode":"01","pesan":"Data Backup Di Temukan","data":' + JSON.stringify(dtbackup) + '}');
    }
});

app.post("/detail_backup", async (req, res) => {

    try {

        let idbackup = req.body.id_backup;
        console.log("ID BACKUP:", idbackup);

        const dtdetail = await db.bacaDetailBackup(idbackup);
         console.log("HASIL DETAIL:", dtdetail);

        if(dtdetail == false){

            return res.json({
                kode: "00",
                pesan: "Data Detail Backup Tidak Di Temukan"
            });

        }

        return res.json({
            kode: "01",
            pesan: "Data Detail Backup Di Temukan",
            data: dtdetail
        });

    } catch(err){

        console.log(err);

        return res.status(500).json({
            error: err.message
        });

    }

});

module.exports = app;