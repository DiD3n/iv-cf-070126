import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication} from '@nestjs/platform-express'
import { AppModule } from './app.module';
import { engine } from 'express-handlebars';
import { join } from 'node:path';

if (!process.env.MDB_CONNECTION_STRING) {

  // simple check reduce headaches later
  // note: would consider using zod for full validation later
  throw new Error('MDB_CONNECTION_STRING is not set in environment variables, make sure .env file is present and configured correctly');
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  app.useStaticAssets(join(__dirname, '..', 'public'));
  
  app.setBaseViewsDir(join(__dirname, '..', 'templates'));
  
  console.log('Templates dir:', join(__dirname, '..', 'templates'));
  
  app.engine(
    'hbs',
    engine({
      extname: '.hbs',
      layoutsDir: join(__dirname, '..', 'templates', 'layouts'),
      defaultLayout: 'main',
    }),
  );
  app.setViewEngine('hbs');
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
