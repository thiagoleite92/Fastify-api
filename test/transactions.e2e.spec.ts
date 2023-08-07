import { execSync } from 'node:child_process';
import { expect, beforeAll, afterAll, describe, it, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/app/app';

describe('Transactions Routes', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    execSync('npm run knex -- migrate:rollback --all');
    execSync('npm run knex -- migrate:latest');
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

  it('should be able to list an especific transaction', async () => {
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

    const transactionId = listTransactionsResponse.body.transactions[0].id;

    const getTransactionResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies);

    expect(getTransactionResponse.statusCode).toEqual(200);
    expect(getTransactionResponse.body.transaction).toEqual(
      expect.objectContaining({
        title: 'New transaction',
        amount: 4000,
      })
    );
  });

  it('should be able to get the summary', async () => {
    const transaction1 = {
      title: 'First transaction',
      amount: 200,
      type: 'credit',
    };

    const transaction2 = {
      title: 'Second transaction',
      amount: 800,
      type: 'credit',
    };

    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send(transaction1);
    const cookies = createTransactionResponse.get('Set-Cookie');

    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies)
      .send(transaction2);

    const listTransactionsResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies);

    expect(listTransactionsResponse.statusCode).toEqual(200);
    expect(listTransactionsResponse.body.summary).toEqual(
      expect.objectContaining({
        amount: 1000,
      })
    );
  });
});
