import { Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { AlevaApiGatewayService } from "apps/aleva-api-gateway/src/aleva-api-gateway.service";
import { AlevaApiGatewayController } from "apps/aleva-api-gateway/src/aleva-api-gateway.controller";

@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                host: process.env.EMAIL_SERVER,
                port: 587,
                secure: false,
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.EMAIL_PASSWORD,
                }
            },
            template: {
              dir: __dirname + "../../templates",
              adapter: new HandlebarsAdapter(),
              options: {
                strict: true,
              },
            },
        })
    ],
    controllers: [AlevaApiGatewayController],
    providers: [AlevaApiGatewayService]
})
export class MailModule {}
