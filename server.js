const express = require('express');
const { createCanvas, loadImage } = require('@napi-rs/canvas');

const app = express();
app.use(express.json());

app.get('/canvas/welcome', async (req, res) => {
  const name = req.query.name || 'Guest';
  const gcname = req.query.gcname || 'Group';
  const pp = req.query.pp || 'https://i.ibb.co/1K0QbJk/IMG-20201219-130032-147.jpg';
  const bg = req.query.bg || 'https://telegra.ph/file/1936bbae8ec571186b5d3.jpg';
  const membercount = req.query.membercount || 0;
  const gcicon = req.query.gcicon || 'https://i.ibb.co/jfZVKmC/babi2.jpg';

  const canvasObject = createCanvas(600, 400);
  const ctx = canvasObject.getContext('2d');

  // Menggambar background
  const background = await loadImage(bg);
  ctx.drawImage(background, 0, 0, canvasObject.width, canvasObject.height);

  // Menggambar foto profil dengan batas lingkaran
  const profilePic = await loadImage(pp);
  const profilePicSize = 100;
  const profilePicX = 50;
  const profilePicY = canvasObject.height / 2 - profilePicSize / 2;
  ctx.save();
  ctx.beginPath();
  ctx.arc(
    profilePicX + profilePicSize / 2,
    profilePicY + profilePicSize / 2,
    profilePicSize / 2,
    0,
    2 * Math.PI
  );
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(profilePic, profilePicX, profilePicY, profilePicSize, profilePicSize);
  ctx.restore();

  // Menuliskan teks selamat datang
  const welcomeTextY = 200;
  const nameTextY = 250;
  const groupTextY = 300;
  const memberCountTextY = 330;
  const textX = 200;
  
  ctx.font = '30px Arial';
  ctx.fillStyle = 'white';
  ctx.fillText('Welcome,', textX, welcomeTextY);
  ctx.font = 'bold 40px Arial';
  ctx.fillText(name, textX, nameTextY);

  // Menuliskan informasi grup
  ctx.font = '20px Arial';
  ctx.fillText(`Group: ${gcname}`, textX, groupTextY);
  ctx.fillText(`Members: ${membercount}`, textX, memberCountTextY);

  // Menggambar ikon grup dengan batas persegi
  const groupIcon = await loadImage(gcicon);
  const groupIconSize = 100;
  const groupIconX = canvasObject.width - groupIconSize - 50;
  const groupIconY = canvasObject.height / 2 - groupIconSize / 2;
  ctx.save();
  ctx.beginPath();
  ctx.rect(groupIconX, groupIconY, groupIconSize, groupIconSize);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(groupIcon, groupIconX, groupIconY, groupIconSize, groupIconSize);
  ctx.restore();

  // Mengirimkan gambar sebagai respons
  res.set('Content-Type', 'image/png');
  res.send(canvasObject.toBuffer());
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
