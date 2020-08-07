import { DocumentBuilder } from '@nestjs/swagger';

export function setupSwagger(
  title: string = '',
  description: string = '',
  version: string = '1.0.0',
  tag: string = 'api',
): any {
  return new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setVersion(version)
    .addTag(tag)
    .build();
}
