import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BiLike } from "react-icons/bi";
import { BiSolidLike } from "react-icons/bi";

// const blogs = [
//   {
//     id: 1,
//     title: "The Rise of AI in Everyday Life",
//     date: "March 1, 2025",
//     image: "https://source.unsplash.com/800x400/?artificial,intelligence",
//     content: "Artificial Intelligence (AI) is now integrated into our lives in many ways...",
//     author: "Sophia Carter",
//   },
// ];

const SingleBlogPage = () => {
  const { blogId } = useParams();
  console.log(blogId);
  
  // const blog = blogs.find((b) => b.id === Number(id));

  const [blog, setBlog] = React.useState(null);
  const [likes, setLikes] = React.useState(0);
  const [isLiked, setIsLiked] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/blog/${blogId}`)
    .then((response) => {
      console.log(response.data);
      setBlog(response.data);
      setLikes(response.data.likes);
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      setLoading(false);
    });
  }, [blogId]);

  if (!blog) {
    return <div className="text-center text-red-500 text-lg">Blog not found!</div>;
  }
  const likeBlog = async () => {
    console.log('Like Blog');
    if(isLiked){
      setLikes((prevLikes) => prevLikes - 1);
      setIsLiked(false);
    }else{
      setLikes((prevLikes) => prevLikes + 1);
      setIsLiked(true);
    }    
  };

  return !loading &&  (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <img className="w-full h-72 object-cover rounded-t-lg" src={blog.image} alt={blog.title} />
      <div className='flex justify-end items-center mt-2 p-2'>
            {blog.views} Views  .  {likes}  {
              isLiked ? <button onClick={likeBlog}><BiSolidLike /></button> : <button onClick={likeBlog}><BiLike /></button>
            }
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mt-4">{blog.title}</h1>
      <p className="text-gray-600 mt-2">{blog.createdAt} by {blog.owner.username}</p>
      <p className="text-gray-700 mt-4">{blog.content}</p>
    </div>
  );
};

export default SingleBlogPage;
