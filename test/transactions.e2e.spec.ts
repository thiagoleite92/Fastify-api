import { expect, beforeAll, afterAll, describe, it } from 'vitest';
import request from 'supertest';
import { app } from '../src/app/app';

describe('Transactions Routes', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should user able to create a new transaction', async () => {
    const response = await request(app.server).post('/transactions').send({
      title: 'New Transacation',
      amount: 5000,
      type: 'credit',
    });

    expect(response.statusCode).toEqual(201);
  });

  it('should be able to list all transactions', async () => {
    const transaction = {
      title: 'New transaction',
      amount: 4000,
      type: 'credit',
    };

    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send(transaction);
    const cookies = createTransactionResponse.get('Set-Cookie');

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies);

    expect(listTransactionsResponse.statusCode).toEqual(200);
    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'New transaction',
        amount: 4000,
      }),
    ]);
  });
});
