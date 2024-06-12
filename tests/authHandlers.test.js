import request from 'supertest';
import express from 'express';
import authRouter from '../src/api/auth.mjs';
import prisma from '../src/modules/db.mjs';

const app = express();
app.use(express.json());
app.use('/auth', authRouter);

beforeAll(async () => {
  // Setup the test database or mock Prisma
});

afterAll(async () => {
  // Clean up the test database or mock Prisma
  await prisma.$disconnect();
});

describe('Auth Handlers', () => {
  it('should create an admin', async () => {
    const res = await request(app)
      .post('/auth/create-admin')
      .send({ email: 'admin@example.com', password: 'password123' });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('token');
  });

  it('should fail to create an admin with an existing email', async () => {
    await request(app)
      .post('/auth/create-admin')
      .send({ email: 'admin@example.com', password: 'password123' });

    const res = await request(app)
      .post('/auth/create-admin')
      .send({ email: 'admin@example.com', password: 'password123' });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('success', false);
  });

  it('should login an admin', async () => {
    await request(app)
      .post('/auth/create-admin')
      .send({ email: 'admin@example.com', password: 'password123' });

    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'admin@example.com', password: 'password123' });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('token');
  });

  it('should fail to login with incorrect credentials', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'admin@example.com', password: 'wrongpassword' });

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('success', false);
  });

  it('should logout an admin', async () => {
    const loginRes = await request(app)
      .post('/auth/login')
      .send({ email: 'admin@example.com', password: 'password123' });

    const token = loginRes.body.token;
    const res = await request(app)
      .get('/auth/logout')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success', true);
  });
});