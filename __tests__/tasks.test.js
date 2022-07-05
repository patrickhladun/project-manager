const supertest = require('supertest');
const mongoose = require('mongoose');
const { createServer } = require('../utils/server');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = createServer();

const taskPayload = {
  name: "And one more task added by Postman",
  description: "Simple description"
}

describe('task', () => {

  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe('add task route', () => {
    describe('add the task', () => {
      it('should return 200 and the task', async () => {

        const { statusCode, body } = await supertest(app)
        .post('/api/task')
        .set('Content-type', 'application/json')
        .send(taskPayload);

        expect(statusCode).toBe(200);
        expect(body).toEqual({
          "__v": 0,
          "_id": expect.any(String),
          "name": "And one more task added by Postman",
          "description": "Simple description",
        })
      });
    })
  });
});

