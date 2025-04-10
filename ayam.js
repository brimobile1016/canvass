const { exec } = require('child_process');

const zipFileName = 'api.zip';

// Jalankan perintah zip dari shell
exec(`zip -r ${zipFileName} . -x ${zipFileName}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`❌ Gagal membuat zip: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`⚠️ Peringatan: ${stderr}`);
  }
  console.log(`✅ Berhasil membuat ${zipFileName}`);
});
