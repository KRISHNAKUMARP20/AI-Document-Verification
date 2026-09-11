import app from '../server';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4.5mb',
    },
  },
  maxDuration: 60,
};

export default app;
