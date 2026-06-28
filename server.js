const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Wajib untuk membaca data JSON dari halaman index.html
app.use(express.json());
app.use(express.static(__dirname));

const logPath = path.join(__dirname, 'log.json');

// Route untuk dipanggil kalau kamu mau melihat isi log rahasianya secara terpisah
app.get('/api/log', (req, res) => {
    fs.readFile(logPath, 'utf8', (err, data) => {
        if (err) {
            return res.json({ total_penolakan: 0, status_terakhir: "Belum merespons" });
        }
        try {
            res.json(JSON.parse(data || '{}'));
        } catch (e) {
            res.json({ total_penolakan: 0, status_terakhir: "Belum merespons" });
        }
    });
});

// Route untuk memproses write dan rewrite file log.json
app.post('/api/log', (req, res) => {
    const { noCount, status } = req.body;
    
    const newData = {
        total_penolakan: noCount || 0,
        status_terakhir: status || "Tidak diketahui",
        waktu_update: new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })
    };

    fs.writeFile(logPath, JSON.stringify(newData, null, 2), (err) => {
        if (err) {
            console.error("Gagal menulis file log:", err);
            return res.status(500).send("Gagal menulis log.");
        }
        res.json({ message: "Log berhasil diperbarui!", data: newData });
    });
});

app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`Server aktif! Buka halaman utama: http://localhost:${PORT}`);
    console.log(`Buka & panggil log rahasia di: http://localhost:${PORT}/api/log`);
    console.log(`==================================================`);
});