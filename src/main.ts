import { NestFactory } from '@nestjs/core';
import { NestExpressApplication} from '@nestjs/platform-express'
import { AppModule } from './app.module';
import { join } from 'node:path';
import { engine } from 'express-handlebars';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  await app.listen(process.env.PORT ?? 3000);

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
}
bootstrap();
