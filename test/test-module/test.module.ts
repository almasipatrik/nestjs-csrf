import { CSRFModule } from './../../src/csrf.module';
import { Module, RequestMethod } from '@nestjs/common';
import { TestController } from './test.controller';

@Module({
  controllers: [TestController],
  imports: [
    CSRFModule.register({
      cookie: { key: '_csrf' },
      expires: 3600,
      encryptionKey: '8E7Gz53uKu4M9TOQyUs9lCDrS8ZL6wmk',
      ignoredMethods: [
        RequestMethod.GET,
        RequestMethod.HEAD,
        RequestMethod.OPTIONS,
      ],
      ignoredPaths: [],
    }),
  ],
})
export class TestModule {}
