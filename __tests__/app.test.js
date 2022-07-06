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
					comment_count: expect.any(Number),
				});
			});
	});
	test("status:404, responds with 404 not found when passed invalid id", () => {
		return request(app)
			.get("/api/articles/999999")
			.expect(404)
			.then(({ body }) => {
				const { msg } = body;
				expect(msg).toEqual("Not found");
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
				expect(msg).toEqual("Not found");
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

// describe(" /api/articles/:article_id/comments", () => {
// 	test("responds with an array of comment objects", () => {
// 		return request(app)
// 			.get("/api/articles/1/comments")
// 			.expect(200)
// 			.then(({ body }) => {
// 				const { comments } = body;
// 				expect(comments).toBeInstanceOf(Array);
// 				expect(comments.length).toBe(11);
// 				comments.forEach((comment) => {
// 					expect(comment).toEqual(
// 						expect.objectContaining({
// 							comment_id: expect.any(Number),
// 							votes: expect.any(Number),
// 							created_at: expect.any(String),
// 							author: expect.any(String),
// 							body: expect.any(String),
// 						})
// 					);
// 				});
// 			});
// 	});

// 	test("status:400, responds with 400 not found when passed id that is not number", () => {
// 		return request(app)
// 			.get("/api/articles/banana/comments")
// 			.expect(400)
// 			.then(({ body }) => {
// 				const { msg } = body;
// 				expect(msg).toEqual("Bad request");
// 			});
// 	});
// 	test("status:200, responds with empty array when passed article with no associated comments", () => {
// 		return request(app)
// 			.get("/api/articles/4/comments")
// 			.expect(200)
// 			.then(({ body }) => {
// 				const { comments } = body;
// 				expect(comments).toBeInstanceOf(Array);
// 				expect(comments.length).toBe();
// 			});
// 	});
// 	test("status:404, responds with 404 not found when passed non-existent id", () => {
// 		return request(app)
// 			.get("/api/articles/9998999/comments")
// 			.expect(404)
// 			.then(({ body }) => {
// 				const { msg } = body;
// 				expect(msg).toEqual("Not found");
// 			});
// 	});
// });

// describe("GET /api/users", () => {
// 	test("status: 200, responds with array of users", () => {
// 		return request(app)
// 			.get("/api/users")
// 			.expect(200)
// 			.then(({ body }) => {
// 				const { users } = body;
// 				expect(users).toBeInstanceOf(Array);
// 				expect(users.length).toBe(4);
// 				users.forEach((user) => {
// 					expect(user).toEqual(
// 						expect.objectContaining({
// 							name: expect.any(String),
// 							username: expect.any(String),
// 							avatar_url: expect.any(String),
// 						})
// 					);
// 				});
// 			});
// 	});
// });

// describe.only("GET /api/articles", () => {
// 	test("status: 200, responds with array of articles", () => {
// 		return request(app)
// 			.get("/api/articles")
// 			.expect(200)
// 			.then(({ body }) => {
// 				const { articles } = body;
// 				expect(articles).toBeInstanceOf(Array);
// 				expect(articles.length).toBe(12);
// 				articles.forEach((article) => {
// 					expect(article).toEqual(
// 						expect.objectContaining({
// 							author: expect.any(String),
// 							title: expect.any(String),
// 							article_id: expect.any(Number),
// 							topic: expect.any(String),
// 							created_at: expect.any(String),
// 							votes: expect.any(Number),
// 							comment_count: expect.any(Number),
// 						})
// 					);
// 				});
// 			});
// 	});
// 	test("status: 200, responds with array of articles correctly sorted and filtered", () => {
// 		return request(app)
// 			.get("/api/articles?sort_by=author&order=desc&topic=mitch")
// 			.expect(200)
// 			.then(({ body }) => {
// 				const { articles } = body;
// 				expect(articles).toBeInstanceOf(Array);
// 				expect(articles.length).toBe(11);
// 				expect(articles).toBeSorted({key: "author", descending: true})
// 				articles.forEach((article) => {
// 					expect(article.topic).toBe("mitch")
// 				})
// 			});
// 	});
// 	test("status: 200, responds with array of articles correctly sorted and filtered using defaults", () => {
// 		return request(app)
// 			.get("/api/articles")
// 			.expect(200)
// 			.then(({ body }) => {
// 				const { articles } = body;
// 				expect(articles).toBeInstanceOf(Array);
// 				expect(articles.length).toBe(12);
// 				expect(articles).toBeSorted({key: "created_at", descending: true})
				
// 			});
// 	});
// 	test.only("status: 200, responds with empty array when passed topic with no associated articles", () => {
// 		return request(app)
// 			.get("/api/articles?sort_by=author&order=desc&topic=southstand")
// 			.expect(200)
// 			.then(({ body }) => {
// 				const { articles } = body;
// 				expect(articles).toBeInstanceOf(Array);
// 				expect(articles.length).toBe(0);
// 			});
// 	});
// 	test("status: 400, responds with empty array when passed order value which is not true or false", () => {
// 		return request(app)
// 			.get("/api/articles?sort_by=author&order=billybremner&topic=southstand")
// 			.expect(400)
// 			.then(({ body }) => {
// 				const { msg } = body;
// 				expect(msg).toEqual("Bad request");
// 			});
// 	});
// });
