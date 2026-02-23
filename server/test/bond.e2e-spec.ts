import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import request from 'supertest';
import { Server } from 'http';

import { AppModule } from '@/app.module';
import type { BondCalculationResponseDto } from '@/bond/dto';

describe('POST /api/v1/bond/calculate (e2e)', () => {
  let app: INestApplication;
  let httpServer: Server;

  beforeAll(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = testModule.createNestApplication();
    app.setGlobalPrefix('api');
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    });
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
    httpServer = app.getHttpServer() as Server;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return 201 with valid bond parameters', async () => {
    const response = await request(httpServer)
      .post('/api/v1/bond/calculate')
      .send({
        faceValue: 1000,
        couponRate: 5,
        marketPrice: 950,
        yearsToMaturity: 10,
        couponFrequency: 2,
      })
      .expect(201);

    const calculationResponse = response.body as BondCalculationResponseDto;
    expect(calculationResponse.currentYield).toBeCloseTo(5.26, 1);
    expect(calculationResponse.yieldToMaturity).toBeGreaterThan(5);
    expect(calculationResponse.totalInterest).toBe(500);
    expect(calculationResponse.bondStatus).toBe('discount');
    expect(calculationResponse.cashFlowSchedule).toHaveLength(20);
  });

  it('should return 400 when face value is negative', () => {
    return request(httpServer)
      .post('/api/v1/bond/calculate')
      .send({
        faceValue: -100,
        couponRate: 5,
        marketPrice: 950,
        yearsToMaturity: 10,
        couponFrequency: 2,
      })
      .expect(400);
  });

  it('should return 400 when coupon rate exceeds 100', () => {
    return request(httpServer)
      .post('/api/v1/bond/calculate')
      .send({
        faceValue: 1000,
        couponRate: 150,
        marketPrice: 950,
        yearsToMaturity: 10,
        couponFrequency: 2,
      })
      .expect(400);
  });

  it('should return 400 when years to maturity is not an integer', () => {
    return request(httpServer)
      .post('/api/v1/bond/calculate')
      .send({
        faceValue: 1000,
        couponRate: 5,
        marketPrice: 950,
        yearsToMaturity: 10.5,
        couponFrequency: 2,
      })
      .expect(400);
  });

  it('should return 400 when coupon frequency is invalid', () => {
    return request(httpServer)
      .post('/api/v1/bond/calculate')
      .send({
        faceValue: 1000,
        couponRate: 5,
        marketPrice: 950,
        yearsToMaturity: 10,
        couponFrequency: 3,
      })
      .expect(400);
  });

  it('should return 400 when required fields are missing', () => {
    return request(httpServer)
      .post('/api/v1/bond/calculate')
      .send({
        faceValue: 1000,
      })
      .expect(400);
  });

  it('should return 400 when unknown properties are included', () => {
    return request(httpServer)
      .post('/api/v1/bond/calculate')
      .send({
        faceValue: 1000,
        couponRate: 5,
        marketPrice: 950,
        yearsToMaturity: 10,
        couponFrequency: 2,
        unknownField: 'should be rejected',
      })
      .expect(400);
  });

  it('should accept zero coupon rate for zero-coupon bonds', async () => {
    const response = await request(httpServer)
      .post('/api/v1/bond/calculate')
      .send({
        faceValue: 1000,
        couponRate: 0,
        marketPrice: 800,
        yearsToMaturity: 5,
        couponFrequency: 1,
      })
      .expect(201);

    const calculationResponse = response.body as BondCalculationResponseDto;
    expect(calculationResponse.currentYield).toBe(0);
    expect(calculationResponse.totalInterest).toBe(0);
    expect(calculationResponse.bondStatus).toBe('discount');
  });
});
