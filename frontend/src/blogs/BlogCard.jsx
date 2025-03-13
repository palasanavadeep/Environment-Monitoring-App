import React from 'react';
import { Link } from 'react-router-dom';
import { FcLike } from 'react-icons/fc';

const BlogCard = ({ _id, title, likes, image, createdAt, owner, isFeatured }) => {
  return isFeatured ? (
    <div className="relative w-full  rounded-lg overflow-hidden shadow-lg">
      <img className="w-full h-72 object-cover" src={image} alt={title} />
      <div className="absolute bottom-6 left-6 bg-white p-4 rounded-lg shadow-md w-2/3">
        <div className='flex items-stretch'>
        <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded">Technology</span>
        
        </div>
        <h2 className="text-xl font-bold mt-2">{title}</h2>
        <div className="text-gray-500 text-sm mt-1">By {owner.username} • {createdAt}</div>
      </div>
    </div>
  ) : (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <img className="w-full h-48 object-cover" src={image} alt={title} />
      <div className="p-4 md-5">
      <div className='flex justify-between'>
        <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded ">Technology</span>
        <div className='flex items-center justify-center '> 20K Views  .  {likes}  <FcLike /> </div>
        </div>
        <h3 className="font-bold text-lg mt-2">{title}</h3>
        <p className="text-gray-600 text-sm mt-1">By {owner.username} • {createdAt}</p>
        <Link to={`/blogs/${_id}`} className="text-blue-500 text-sm font-semibold hover:underline mt-2 block">
          Read more...
        </Link>
      </div>
    </div>
  );
};
export default BlogCard;
