const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const sorted = require("jest-sorted");

beforeEach(() => {
	return seed(testData);
});

afterAll(() => {
	db.end();
});


describe("GET /api/topics", () => {
	test("status:200, responds with an array of topic objects", () => {
		return request(app)
			.get("/api/topics")
			.expect(200)
			.then(({ body }) => {
				const { topics } = body;
				expect(topics).toBeInstanceOf(Array);
				expect(topics.length).toBe(3);
				topics.forEach((topic) => {
					expect(topic).toEqual(
						expect.objectContaining({
							description: expect.any(String),
							slug: expect.any(String),
						})
					);
				});
			});
	});
	test("status:404, responds with not found when passed invalid path", () => {
		return request(app)
			.get("/api/leedsunitedchampions1992")
			.expect(404)
			.then(({ body }) => {
				const { msg } = body;
				expect(msg).toEqual("Bad path");
			});
	});
});


describe("GET /api/articles/:article_id", () => {
	test("status:200, responds with article object", () => {
		return request(app)
			.get("/api/articles/2")
			.expect(200)
			.then(({ body }) => {
				const { article } = body;
				expect(article).toEqual({
					article_id: 2,
					title: expect.any(String),
					topic: expect.any(String),
					author: expect.any(String),
					body: expect.any(String),
					created_at: expect.any(String),
					votes: expect.any(Number),
				});
			});
	});
	test("status:404, responds with 404 not found when passed invalid id", () => {
		return request(app)
			.get("/api/articles/999999")
			.expect(404)
			.then(({ body }) => {
				const { msg } = body;
				expect(msg).toEqual("No article found for article_id 999999");
			});
	});
  test("status:400, responds with 404 not found when passed id that is not number", () => {
		return request(app)
			.get("/api/articles/banana")
			.expect(400)
			.then(({ body }) => {
				const { msg } = body;
				expect(msg).toEqual("Bad request");
			});
	});
});

describe("PATCH /api/articles/:article_id", () => {
	test("status:200, responds with article object with correctly incremented votes when passed positive value", () => {
		const votesObject = {
			inc_votes: 10,
		};
		return request(app)
			.patch("/api/articles/2")
			.send(votesObject)
			.expect(200)
			.then(({ body }) => {
				const { article } = body;
				expect(article.votes).toBe(10);
			});
	});
	test("status:200, responds with article object with correctly incremented votes when passed negative value", () => {
		const votesObject = {
			inc_votes: -10,
		};
		return request(app)
			.patch("/api/articles/1")
			.send(votesObject)
			.expect(200)
			.then(({ body }) => {
				const { article } = body;
				expect(article.votes).toBe(90);
			});
	});
	test("status:404, responds with 404 not found when passed invalid id", () => {
    const votesObject = {
			inc_votes: -10,
		};
		return request(app)
			.patch("/api/articles/999999")
			.send(votesObject)
			.expect(404)
			.then(({ body }) => {
				const { msg } = body;
				expect(msg).toEqual("No article found for article_id 999999");
			});
	});
  test("status:400, responds with 404 not found when passed id that is not number", () => {
    const votesObject = {
			inc_votes: -10,
		};
		return request(app)
			.patch("/api/articles/banana")
			.send(votesObject)
			.expect(400)
			.then(({ body }) => {
				const { msg } = body;
				expect(msg).toEqual("Bad request");
			});
	});
  test("status:400, responds with 404 not found when passed inc_votes that is not number", () => {
    const votesObject = {
			inc_votes: "cheese",
		};
		return request(app)
			.patch("/api/articles/2")
			.send(votesObject)
			.expect(400)
			.then(({ body }) => {
				const { msg } = body;
				expect(msg).toEqual("Bad request");
			});
	});
});

describe("GET /api/articles/:article_id (comment count)", () => {
	test("status:200, responds with article object with comment count when comment_count query set to true", () => {
		return request(app)
			.get("/api/articles/2?comment_count=true")
			.expect(200)
			.then(({ body }) => {
				const { article } = body;
				expect(article).toEqual({
					article_id: 2,
					title: expect.any(String),
					topic: expect.any(String),
					author: expect.any(String),
					body: expect.any(String),
					created_at: expect.any(String),
					votes: expect.any(Number),
					comment_count: expect.any(Number)
				});
			});
	});
	test("status:200, responds with article object without comment count when comment_count query set to false", () => {
		return request(app)
			.get("/api/articles/2?comment_count=false")
			.expect(200)
			.then(({ body }) => {
				const { article } = body;
				expect(article).toEqual({
					article_id: 2,
					title: expect.any(String),
					topic: expect.any(String),
					author: expect.any(String),
					body: expect.any(String),
					created_at: expect.any(String),
					votes: expect.any(Number)
				});
			});
	});
	test("status:200, responds with article object without comment count when comment_count query set to false", () => {
		return request(app)
			.get("/api/articles/2?comment_count=false")
			.expect(200)
			.then(({ body }) => {
				const { article } = body;
				expect(article).toEqual({
					article_id: 2,
					title: expect.any(String),
					topic: expect.any(String),
					author: expect.any(String),
					body: expect.any(String),
					created_at: expect.any(String),
					votes: expect.any(Number)
				});
			});
	});
	test("status:404, responds with 404 not found when passed invalid id", () => {
		return request(app)
			.get("/api/articles/999999?comment_count=true")
			.expect(404)
			.then(({ body }) => {
				const { msg } = body;
				expect(msg).toEqual("No article found for article_id 999999");
			});
	});
  test("status:400, responds with 404 not found when passed id that is not number", () => {
		return request(app)
			.get("/api/articles/banana?comment_count=true")
			.expect(400)
			.then(({ body }) => {
				const { msg } = body;
				expect(msg).toEqual("Bad request");
			});
	});
	test("status:400, responds with 404 not found when passed comment count that is not equal to true or false", () => {
		return request(app)
			.get("/api/articles/1?comment_count=lukeAyling")
			.expect(400)
			.then(({ body }) => {
				const { msg } = body;
				expect(msg).toEqual("Invalid query parameter");
			});
	});
});
