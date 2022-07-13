import { CSRFModuleOptions } from './interfaces/csrf-module-options';
import { Inject, Injectable } from '@nestjs/common';
import { CSRF_MODULE_OPTIONS } from './csrf.constants';
import * as crypto from 'crypto';
import InvalidCSRFException from './exceptions/invalid-token.exception';

@Injectable()
export class CSRFService {
  constructor(
    @Inject(CSRF_MODULE_OPTIONS)
    private readonly options: CSRFModuleOptions,
  ) {}

  verify(
    text: string,
    encryptionKey: string = this.options.encryptionKey,
  ): string {
    try {
      let textParts: string[] = text.includes(':') ? text.split(':') : [];
      let iv = Buffer.from(textParts.shift() || '', 'binary');
      let encryptedText = Buffer.from(textParts.join(':'), 'hex');
      let decipher = crypto.createDecipheriv(
        'aes-256-cbc',
        Buffer.from(encryptionKey),
        iv,
      );
      let decrypted = decipher.update(encryptedText);
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      return decrypted.toString();
    } catch (error) {
      throw InvalidCSRFException;
    }
  }

  sign(data: any, encryptionKey: string = this.options.encryptionKey): string {
    try {
      data.expires = new Date(Date.now() + this.options.expires * 1000);

      let iv = Buffer.from(crypto.randomBytes(16))
        .toString('hex')
        .slice(0, 16);
      let cipher = crypto.createCipheriv(
        'aes-256-cbc',
        Buffer.from(encryptionKey),
        iv,
      );
      let encrypted = cipher.update(JSON.stringify(data));
      encrypted = Buffer.concat([encrypted, cipher.final()]);
      return iv + ':' + encrypted.toString('hex');
    } catch (error) {
      throw InvalidCSRFException;
    }
  }
}
