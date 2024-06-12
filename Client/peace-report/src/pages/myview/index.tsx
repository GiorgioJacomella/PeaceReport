import { GetArticlesAPI, IArticle } from "@/src/api";
import ArticlePreview from "@/src/components/article/preview";
import Nav from "@/src/components/navBars/Nav";
import React, { useEffect, useState } from "react";

const MyView: React.FC = () => {
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await GetArticlesAPI();
        setArticles(response.articles);
      } catch (error) {
        setError("Error fetching articles");
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, []);

  return (
    <main className="min-h-screen flex flex-col">
      <Nav />
      <div className="flex-col flex items-center justify-center p-4 md:mt-20">
        {error && <div className="text-red-500 mt-4">{error}</div>}
        {articles.length === 0 && !error && (
          <div className="text-gray-500 mt-4">There are no articles at the moment</div>
        )}
        {articles.map(article => (
          <ArticlePreview
            key={article.id}
            ID={article.id}
            content={article.content.find(c => c.type === 'image')?.value || ''}
            title={article.title}
            author={article.authorUsername}
          />
        ))}
      </div>
    </main>
  );
};

export default MyView;
