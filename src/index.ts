import express, { Request, Response } from 'express';
import morgan from 'morgan'
import cors from 'cors'
import { logger } from './utils';
import routes from './api';
import { validateRequiredHeaders } from './middlewares/validateHeaders';

const app = express();
const PORT = process.env.PORT || 3000;

// eslint-disable-next-line no-undef

app.use(cors())
app.use(express.json())
app.use(morgan('combined'))

app.get('/api/ping', (_req: Request, res: Response) => {
  res.json({message: 'pong'});
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
app.use(validateRequiredHeaders);
app.use('/api/', routes);

app.listen(PORT, () =>
  logger.info(`Astro Follow Listening on port: ${PORT}`)
)


