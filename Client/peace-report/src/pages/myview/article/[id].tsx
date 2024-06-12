import { useState, useEffect } from 'react';
import { GetArticleByIdAPI, IArticle } from '@/src/api';
import Nav from '@/src/components/navBars/Nav';
import { useRouter } from 'next/router';
import Content from '@/src/components/article/Content';
import PublicButton from '@/src/components/buttons/PublicButton';
import { getUserInfoAPI } from '@/src/api';

const Article: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const [article, setArticle] = useState<IArticle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAuthor, setIsAuthor] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      const fetchArticle = async () => {
        try {
          const fetchedArticle = await GetArticleByIdAPI(id as string);
          setArticle(fetchedArticle);
          
          const userInfo = await getUserInfoAPI();
          if (userInfo.username === fetchedArticle.authorUsername) {
            setIsAuthor(true);
          }
        } catch (error) {
          setError((error as Error).message);
        }
      };

      fetchArticle();
    }
  }, [id]);

  const handleEditClick = () => {
    router.push(`/myview/myArticle/edit/${id}`);
  };

  if (error) {
    return (
      <>
        <Nav />
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Article not found or Error occurred</h1>
            <PublicButton text="Back to Home" action={() => router.push('/myview')} />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Nav />
      <div className="container mx-auto p-4 md:mt-16 md:w-2/3 lg:w-1/2">
        {isAuthor && (
          <div className="text-right mt-8">
            <PublicButton text="Edit Article" action={handleEditClick} />
          </div>
        )}
        <h1 className="text-4xl font-bold mb-6 text-center">{article?.title}</h1>
        <p className='text-center'>Author: {article?.authorUsername}</p>
        <br></br>
        {article && <Content content={article.content} />}
      </div>
    </>
  );
};

export default Article;
