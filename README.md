<h1 align="center"></h1>

<div align="center">
  <a href="http://nestjs.com/" target="_blank">
    <img src="https://nestjs.com/img/logo_text.svg" width="150" alt="Nest Logo" />
  </a>
</div>

<h3 align="center">NestJS CSRF Package</h3>

<div align="center">
  <a href="https://nestjs.com" target="_blank">
    <img src="https://img.shields.io/badge/built%20with-NestJs-red.svg" alt="Built with NestJS">
  </a>
</div>

### Installation

```shell script
npm install nestjs-csrf
```

Async

```typescript
CSRFModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        cookie: { key: '_csrf', httpOnly: true, secure: true ... }, // cookie options
        encryptionKey: configService.get('CSRF_SECRET'), //encryption key with lenght of 32 char
        expires: new Date('2023.01.01.'), // set a date dynamically

        ignoredMethods: [ // exclude request methods
          RequestMethod.GET,
          RequestMethod.HEAD,
          RequestMethod.OPTIONS,
        ],
        ignoredPaths: ['/login'], // exclude route paths
      }),
    }),
```

Sync

```typescript
    CSRFModule.register({
        cookie: { key: '_csrf', httpOnly: true, secure: true ... }, // cookie options
        encryptionKey: "8E7Gz53uKu4M9TOQyUs9lCDrS8ZL6wmk", //encryption key with lenght of 32 char
        expires: new Date('2023.01.01.'), // set a date dynamically
        ignoredMethods: [ // exclude request methods
          RequestMethod.GET,
          RequestMethod.HEAD,
          RequestMethod.OPTIONS,
        ],
        ignoredPaths: ['/login'], // exclude route paths
    }),
```

# Note:

## You must use CSRFInterceptor and CSRF Guard together.

### Locally

```typescript
import { CSRFGuard, CSRFInterceptor } from 'nestjs-csrf';

// Interceptor
@UseInterceptors(CSRFInterceptor)
@Controller()
class AppController {

// Guard
  @UseGuards(CSRFGuard)
  @Post()
  get(): Promise<any> {
    return...
  }
}
```

### Globally

```typescript
import * as cookieParser from 'cookie-parser';
import { CSRFGuard, CSRFInterceptor } from 'nestjs-csrf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.useGlobalInterceptors(new CSRFInterceptor());
  app.useGlobalGuards(new CSRFGuard());
}
```

## Change Log

See [Changelog](CHANGELOG.md) for more information.

## Contributing

Contributions welcome! See [Contributing](CONTRIBUTING.md).

## Author

Patrik Almasi - almasi.patrik@gmail.com

## License
