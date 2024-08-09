import {NestFactory} from "@nestjs/core";
import {INestApplication, Logger, ValidationError, ValidationPipe} from "@nestjs/common";
import {AppModule} from "@feature/root/app.module";
import cookieParser from 'cookie-parser';
import {ConfigKey, configManager} from "@common/config";
import {HttpExceptionFilter} from "@common/config/exception/http-exception.filter";
import {ApiInterceptor} from "@common/api";
import {ValidationException} from "@common/api/api.exception";
import {swaggerConfiguration} from "@common/documentation";


const bootstrap = async (): Promise<void> => {
  const privateKey: string = Buffer.from(process.env.SSL_PRIVATE_KEY, 'base64').toString('utf8');
  const cert: string = Buffer.from(process.env.SSL_CERTIFICATE, 'base64').toString('utf8');

  const httpsOptions: {key: string, cert: string} = {
    key: privateKey,
    cert: cert,
  };

  const app: INestApplication<any> = await NestFactory.create(AppModule, {
    httpsOptions,
  });

  app.use(cookieParser());
  app.enableCors({
    origin: 'https://localhost:4200',
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    credentials: true,
  });


  app.setGlobalPrefix(configManager.getValue(ConfigKey.APP_BASE_URL));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ApiInterceptor());
  app.useGlobalPipes(
      new ValidationPipe({
        exceptionFactory: (validationErrors: ValidationError[] = []) => new ValidationException(validationErrors),
      }),
  );

  swaggerConfiguration.config(app);
  await app.listen(parseInt(configManager.getValue(ConfigKey.APP_PORT), 10));
};

bootstrap().then((): void => {
  const logger: Logger = new Logger('Main Logger');
  logger.log('Server is started !!');
});