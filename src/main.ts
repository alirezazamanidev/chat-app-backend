import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import SwaggerConfigInit from './configs/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  // swagger config
  SwaggerConfigInit(app);
  // set port app
  const PORT = process.env.PORT || 8000;
  await app.listen(PORT, () => {
    console.log(`server running => http://localhost:${PORT}/api`);
    console.log(`swagger running => http://localhost:${PORT}/swagger`);
  });
}
bootstrap();
