import app from './app';
import { env } from './config/env';

app.listen(env.PORT, () => {
  console.log(`El servidor se ha iniciado en el puerto: ${env.PORT}`);
});