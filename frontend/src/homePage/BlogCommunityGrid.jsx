import { Expand } from 'lucide-react';
import WhyUsSwiper from './WhyUsSwiper';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
export default function BlogCommunityGrid() {
  const [blogs, setBlogs] = React.useState([]);
  const [communities, setCommunities] = React.useState([]);
  

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/blog/all`)
      .then((response) => {
        console.log(response.data);
        setBlogs(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });

      axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/getCommunities/all`)
      .then((res) => {
        setCommunities(res.data);
        console.log(" communities : ", res.data);

      })
      .catch((err) => {
        console.error(err);
        alert(err.message);
      });
  }, []);
 

  

  return (
    <div className="grid grid-cols-3 gap-4 p-6">
      {/* Column 1: Two Sections */}
      <div className="col-span-2 flex flex-col gap-4">
        {/* Section 1: Other Content */}
        <WhyUsSwiper />
        {/* Section 2: Full-width Map Card */}
        <div className="bg-white p-6 rounded-lg shadow-lg relative w-full h-150 flex flex-col">
          <iframe 
            src="http://localhost:6000/" 
            className="w-full h-full rounded-lg border border-gray-300" 
            title="India Map"
            style={{ minHeight: '100%', minWidth: '100%' }}
            allowFullScreen>
          </iframe>
          <a 
            href="/full-map" 
            className="absolute top-4 right-4 bg-blue-600 text-white p-2 rounded-full shadow-md hover:bg-blue-700 transition">
            <Expand size={24} />
          </a>
        </div>
      </div>
      
      {/* Column 2: Top Blogs & Top Communities */}
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full border border-gray-300">
        <h2 className="text-2xl font-bold mb-6 text-green-700">Top Blogs</h2>
        {blogs.filter((blog, index) => index < 3).map((blog, index) => (
          <div key={index} className="flex items-center gap-6 border-b pb-3 mb-3 hover:bg-green-100 p-2 rounded-md transition">
            <img src={blog.image} alt={blog?.title} className="w-20 h-20 rounded-md object-cover shadow-md" />
            <div>
              <p className="font-semibold text-lg text-gray-800">{blog.title}</p>
              <p className="text-sm text-gray-600">{blog.description}</p>
            </div>
          </div>
        ))}
        <a href="/blogs" className="text-green-600 text-lg block mt-4 font-bold hover:underline">Show more</a>

        <h2 className="text-2xl font-bold mt-8 mb-6 text-green-700">Top Communities</h2>
        {communities.filter((community, index) => index < 3).map((community, index) => (
          <div key={index} className="flex items-center gap-6 border-b pb-3 mb-3 hover:bg-green-100 p-2 rounded-md transition">
            <img src={community.image} alt={community?.name} className="w-20 h-20 rounded-md object-cover shadow-md" />
            <div>
              <p className="font-semibold text-lg text-gray-800">{community.name}</p>
              <p className="text-sm text-gray-600">{community.description}</p>
            </div>
          </div>
        ))}
        <a href="/communities" className="text-green-600 text-lg block mt-4 font-bold hover:underline">Show more</a>
      </div>
    </div>
  );
}
