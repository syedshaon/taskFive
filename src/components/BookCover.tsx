import React from "react";

const BookCover = ({ imageUrl, title, author }: { imageUrl: string; title: string; author: string }) => {
  return (
    <div className="book-cover">
      <div className="book-cover-inner">
        <img src={imageUrl} alt={title} className="book-cover-image" />
        <div className="book-cover-text">
          <h3 className="text-white font-bold text-sm leading-tight mb-1 line-clamp-2">{title}</h3>
          <p className="text-white text-xs italic">by {author}</p>
        </div>
      </div>
    </div>
  );
};

export default BookCover;
