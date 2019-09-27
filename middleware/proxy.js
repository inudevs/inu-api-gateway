import proxy from 'express-http-proxy-async';
import url from 'url';

import Service from '../models/service';

export const proxyMiddleware = proxy(async (req) => {
  const { params: { route } } = req;
  const path = `/${req.params[0] || ''}`;

  const service = await Service.findOne({ route, proxy: true });
  return url.resolve(service.api, path);
});
