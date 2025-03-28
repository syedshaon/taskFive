import React from "react";

const SmallBookCover = ({ imageUrl, title }: { imageUrl: string; title: string }) => {
  return (
    <div className="relative w-16 h-24 rounded-sm shadow-sm overflow-hidden">
      <img src={imageUrl} alt={title} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
    </div>
  );
};
export default SmallBookCover;
