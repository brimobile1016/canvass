const { createCanvas, loadImage } = require('@napi-rs/canvas');
const Data = {};

module.exports = async function noAnime(query) {
  const obj = {};

  let { reason, location, author, target, penalty } = query;

  const none = [{ reason }, { location }, { author }, { target }, { penalty }]
    .find(que => typeof que[Object.keys(que)[0]] !== 'string' || que[Object.keys(que)[0]] === '');

  if (none) {
    obj.message = `Invalid ${Object.keys(none)[0]} text query!`;
    obj.code = '400';
    return obj;
  }

  try {
    reason = decodeURI(reason);
    location = decodeURI(location);
    author = decodeURI(author);
    target = decodeURI(target);
    penalty = decodeURI(penalty);
  } catch {
    obj.message = "An unexpected error occurred while decoding query!";
    obj.code = '400';
    return obj;
  }

  if (!Data.img) {
    Data.img = await loadImage('https://i.ibb.co/3fq03cZ/noanime.png');
  }

  if (!Data.cross) {
    Data.cross = await loadImage('https://i.ibb.co/Nm6Gzrp/cross.png');
  }

  const canvas = createCanvas(512, 341.2);
  const ctx = canvas.getContext('2d');
  const img = Data.img;
  const cross = Data.cross;

  ctx.fillStyle = 'black';
  ctx.font = '500 12px Arial';
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const reasonLower = reason.toLowerCase();
  const reasonsMap = {
    'anime meme': [16.8, 139.6],
    'anime game': [138.4, 139.6],
    'anime girl': [259.6, 139.6],
    'manga': [381.6, 139.6],
    'hentai': [16.8, 164],
    'trap': [138.4, 164],
    'uwu speech': [259.6, 164],
    'weeb music': [381.6, 164]
  };

  if (reasonsMap[reasonLower]) {
    const [x, y] = reasonsMap[reasonLower];
    ctx.drawImage(cross, x, y, 14.4, 14.4);
  } else {
    ctx.drawImage(cross, 16.8, 189.6, 14.4, 14.4);
    ctx.textAlign = 'left';
    ctx.fillText(reason.substr(0, 50), 80, 196.8, 262);
  }

  ctx.textAlign = 'center';
  ctx.fillText(location.substr(0, 24), 74, canvas.height - 25.2, 100);
  ctx.fillText(author.substr(0, 24), 197.6, canvas.height - 52.8, 100);
  ctx.fillText(target.substr(0, 24), 197.6, canvas.height - 25.2, 100);

  ctx.textAlign = 'left';
  ctx.font = '500 16px Arial';
  ctx.fillText(penalty.substr(0, 10).trim(), 264, canvas.height - 52.8, 100);
  ctx.fillText(penalty.substr(10, 20).trim(), 264, canvas.height - 37.6, 100);
  ctx.fillText(penalty.substr(20, 29).trim(), 264, canvas.height - 24.8, 100);

  obj.stream = true;
  obj.contentType = 'image/png';
  obj.code = '200';
  obj.data = canvas.createPNGStream();

  return obj;
};

module.exports.type = 'query';
module.exports.route = 'noanime';
module.exports.usage = '?reason=text&location=text&author=text&target=text&penalty=text';
