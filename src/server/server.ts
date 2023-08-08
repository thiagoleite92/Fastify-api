import { app } from '../app/app';
import { env } from '../env';

app.get('/health', async (req, replay) => {
  return replay.status(200).send('API ONLINE');
});

app.listen({ port: env.PORT }, (err, address) => {
  console.log(`Server is now listening on ${address}`);
});
