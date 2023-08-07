import { app } from '../app/app';
import { env } from '../env';

app.listen({ port: env.PORT }, (err, address) => {
  console.log(`Server is now listening on ${address}`);
});
