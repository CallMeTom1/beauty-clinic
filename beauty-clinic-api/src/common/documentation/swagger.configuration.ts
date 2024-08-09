import {DocumentBuilder, OpenAPIObject, SwaggerModule} from '@nestjs/swagger';
import {INestApplication} from '@nestjs/common';
class SwaggerConfiguration {
    constructor() {
    }
    config(app: INestApplication<any>) {
        const config = new DocumentBuilder()
            .setTitle('BEAUTY CLINIC API')
            .setDescription('NestJS swagger document')
            .setVersion('1.0')
            .build();
        const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('docs', app, document);
    }
}
const swaggerConfiguration: SwaggerConfiguration = new SwaggerConfiguration();
export {swaggerConfiguration};