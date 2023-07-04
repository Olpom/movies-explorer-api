// Массив доменов, с которых разрешены кросс-доменные запросы
const allowedCors = [
  'http://olpoma-diploma.frontend.nomoreparties.sbs',
  'https://olpoma-diploma.frontend.nomoreparties.sbs',
  'https://olpoma-diploma.nomoreparties.sbs',
  'http://olpoma-diploma.nomoreparties.sbs',
  'http://localhost:3000',
  'localhost:3000',
];

const corsHandler = (req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }

  return next();
};

module.exports = corsHandler;
