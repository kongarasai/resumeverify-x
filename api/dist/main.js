"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const helmet_1 = __importDefault(require("helmet"));
async function bootstrap() {
    console.log('INIT STATE - DB URL in process.env:', process.env.DATABASE_URL);
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { cors: false });
    app.use((0, helmet_1.default)());
    app.enableCors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    const config = new swagger_1.DocumentBuilder()
        .setTitle('ResumeVerify X™ API')
        .setDescription('Universal AI Career, Learning, Placement & Hiring OS')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document);
    const port = process.env.PORT || 5000;
    await app.listen(port);
    console.log(`🚀 ResumeVerify X API running on http://localhost:${port}`);
    console.log(`📚 Swagger Docs: http://localhost:${port}/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map