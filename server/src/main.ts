import { ConfigService } from '@nestjs/config';

import { createConfiguredApp } from '@/app.bootstrap';

async function bootstrap(): Promise<void> {
  const app = await createConfiguredApp();

  const configService = app.get(ConfigService);
  const backendPort = configService.getOrThrow<number>('PORT');

  await app.listen(backendPort);
}

void bootstrap();
