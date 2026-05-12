import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { RootController } from './root.controller';

describe('RootController', () => {
  let controller: RootController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [RootController],
      providers: [
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn().mockReturnValue('Velmont Private Bank'),
          },
        },
      ],
    }).compile();

    controller = moduleRef.get(RootController);
  });

  it('returns API metadata', () => {
    expect(controller.getRoot()).toEqual({
      name: 'Velmont Private Bank',
      status: 'online',
      message: 'Velmont Private Bank API is ready.',
    });
  });
});
