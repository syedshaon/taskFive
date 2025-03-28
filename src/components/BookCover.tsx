import React from "react";
import Image from "next/image";

const BookCover = ({ imageUrl, title, author }: { imageUrl: string; title: string; author: string }) => {
  return (
    <div className="book-cover">
      <div className="book-cover-inner">
        <Image width={200} height={300} src={imageUrl} alt={title} className="book-cover-image" />
        <div className="book-cover-text">
          <h3 className="text-white font-bold text-sm leading-tight mb-1 line-clamp-2">{title}</h3>
          <p className="text-white text-xs italic">by {author}</p>
        </div>
      </div>
    </div>
  );
};

export default BookCover;
