const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');
const User = require('../models/User');

describe('Auth API', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/classroom-chat-test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser', password: 'testpass' });
    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
  });

  it('should not register a user with the same username', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser2', password: 'testpass' });
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser2', password: 'testpass' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Username taken');
  });

  it('should login with correct credentials', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser3', password: 'testpass' });
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser3', password: 'testpass' });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('should not login with wrong credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'wronguser', password: 'wrongpass' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Invalid credentials');
  });
}); 