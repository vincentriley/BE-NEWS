const request = require('supertest');
const app = require('../app');
const db = require('../db/connection');
const testData = require('../db/data/test-data/index');
const seed = require('../db/seeds/seed');
const sorted = require('jest-sorted');

beforeEach(() => {
  return seed(testData)
})

afterAll(() => {
    db.end();
  });

  describe('1. GET /api/topics', () => {
    test('status:200, responds with an array of topic objects', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({ body }) => {
          const { topics } = body;
          expect(topics).toBeInstanceOf(Array);
          expect(topics.length).toBe(3)
          topics.forEach((topic) => {
            expect(topic).toEqual(
              expect.objectContaining({
                description: expect.any(String),
                slug: expect.any(String)
              })
            );
          });
        });
    });
    test('status:404, responds with not found when passed invalid path', () => {
        return request(app)
          .get('/api/leedsunitedchampions1992')
          .expect(404)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toEqual("Not found");
            
          });
      });
  });