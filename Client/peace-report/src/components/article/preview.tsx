import React from "react";
import Link from "next/link";

interface IArticlePreview {
  ID: string;
  content: string;
  title: string;
  author: string;
}

const ArticlePreview: React.FC<IArticlePreview> = (props) => {
  return (
    <Link href={`/myview/article/${props.ID}`}>
      <div className="w-96 rounded-lg shadow-lg m-5 cursor-pointer hover:shadow-xl">
        {props.content && (
          <img src={props.content} alt={props.title} className="rounded-t w-full h-48 object-cover" />
        )}
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2">{props.title}</h3>
          <p className="">Author: {props.author}</p>
        </div>
      </div>
    </Link>
  );
};

export default ArticlePreview;