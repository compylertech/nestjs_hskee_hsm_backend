import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// local
import { AlevaApiGatewayModule } from './aleva-api-gateway.module';
// import { JwtAuthGuard } from '../../auth/src/guards/passport-jwt.guard';

async function bootstrap() {
  const app = await NestFactory.create(AlevaApiGatewayModule);

  const config = new DocumentBuilder()
    .setTitle('Aleva')
    .setDescription('Aleva API description')
    .setVersion('0.0.0.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // const reflector = app.get(Reflector);
  // app.useGlobalGuards(new JwtAuthGuard(reflector));

  await app.listen(process.env.port ?? 3000);
}
bootstrap();
