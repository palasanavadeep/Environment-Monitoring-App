import React, { use } from "react";
import BlogCard from "./BlogCard";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import dateFormatter from "../components/dateFormatter";

const BlogList = () => {
  const [blogs, setBlogs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

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
  }, []);

  return (
    blogs && (
      <div className="max-w-6xl mx-auto pt-4">
        {blogs.length > 0 && <BlogCard {...blogs[0]} isFeatured />}
        <h2 className="text-xl font-bold my-4">
          Latest Environmental Articles
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} {...blog} />
          ))}
        </div>
        <Link to="/blogs/new" className="">
          <div className="fixed bottom-4 right-4  bg-gray-800 text-white text-lg font-semibold p-2 rounded-lg text-center mt-4">
            Add Blog
          </div>
        </Link>
        {/* <Routes>
        <Route path="/add-blog" element={<AddBlogComponent />} />
        <Route path="/blogs/:id" element={<SingleBlogPage />} />
      </Routes> */}
      </div>
    )
  );
};

export default BlogList;
