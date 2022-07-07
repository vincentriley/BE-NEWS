\c nc_news_test

SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, CAST(COUNT(comments.article_id) AS int) AS comment_count FROM articles
		LEFT JOIN comments 
		ON articles.article_id = comments.article_id
        WHERE articles.topic = 'cats'
		GROUP BY articles.article_id
		ORDER BY articles.author DESC;
        