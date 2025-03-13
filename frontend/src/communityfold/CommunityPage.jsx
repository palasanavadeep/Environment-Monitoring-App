import React, { useState, useEffect, useRef } from "react";
import CreateCommunityModal from "./CreateCommunityModal"; // Import the modal component
import axios from "axios";
import { Link } from "react-router-dom";

const images = [
  "../public/carousel5.jpg",
  "../public/carousel7.webp",
  "../public/carousel9.jpeg",
  "../public/carousel6.jpeg",
];

const CommunityPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const yourCommunitiesRef = useRef(null);
  const knowMoreCommunitiesRef = useRef(null);

  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const [popularCommunities, setPopularCommunities] = useState([]);
  const [createdCommunities, setCreatedCommunities] = useState([]);

  useEffect(() => {
    // joined communities
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/getUserCommunities`, {
        withCredentials: true,
      })
      .then((res) => {
        setJoinedCommunities(res.data);
        console.log("joined communities : ", res.data);        
      })
      .catch((err) => {
        console.error(err);
        alert(err.message);
      });

      // all communities / suggestions / popular
      axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/getCommunities/all`)
      .then((res) => {
        setPopularCommunities(res.data);
        console.log("popular communities : ", res.data);

      })
      .catch((err) => {
        console.error(err);
        alert(err.message);
      });

      // communities created by user
      axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/getUserCommunities`, {
        withCredentials: true,
      })
      .then((res) => {
        setCreatedCommunities(res.data);
        console.log("created  communities : ", res.data);        
      })
      .catch((err) => {
        console.error(err);
        alert(err.message);
      });


  }, []);

  

  const joinCommunity = (community) => {
    if (!joinedCommunities.find((c) => c._id === community._id)) {
      // make request to join community
      axios
        .post(`${import.meta.env.VITE_BACKEND_URL}/joinCommunity/${community._id}`, {} , {
          withCredentials: true,
        })
        .then((res) => {
          console.log(res.data);
          setJoinedCommunities([res.data.community ,...joinedCommunities]);
          setPopularCommunities(
            popularCommunities.filter((c) => c._id !== community._id)
          );
          alert("Community @ "+ res.data?.community?.name +" joined successfully!");
        })
        .catch((err) => { 
          console.error(err);
          alert(err.message);
        });
      
    }else{
      alert("You have already joined this community");
    }
  };

  const handleCreateCommunity = (details) => {
    axios
      .post("http://localhost:8000/createCommunity", details, {
        withCredentials: true,
      })
      .then((res) => {
        setCreatedCommunities([...createdCommunities, res.data.community]);
        console.log(res.data);
        alert("Community created successfully!");
      })
      .catch((err) => {
        console.error(err);
        alert(err.message);
      });
  };

  const scrollToYourCommunities = () => {
    yourCommunitiesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToKnowMoreCommunities = () => {
    knowMoreCommunitiesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* Image Carousel Section */}
      <div className="relative w-full h-[50vh] overflow-hidden">
        <div
          className="flex transition-transform duration-1000 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Slide ${index + 1}`}
              className="w-full h-[50vh] object-cover flex-shrink-0"
            />
          ))}
        </div>
        <div className="absolute top-1/2 left-10 transform -translate-y-1/2 text-white">
          <h1 className="text-2xl font-bold">
            It's your time to aid mother earth
          </h1>
          <p>Empower Change by Creating Your Community</p>
          <p>Turn Your Ideas into Action</p>
          <button
            className="mt-4 px-4 py-2 bg-orange-600 text-white text-lg rounded cursor-pointer hover:bg-orange-700 transition-colors duration-300"
            onClick={() => setShowCreateModal(true)}
          >
            Create Community
          </button>
        </div>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentIndex ? "bg-white" : "bg-gray-400"
              }`}
            ></div>
          ))}
        </div>
      </div>

      {/* Create Community Modal */}
      {showCreateModal && (
        <CreateCommunityModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateCommunity}
        />
      )}

      {/* Rest of the code remains the same */}
      {/* Floating Transparent Page Blocks Section */}
      <div
        className="relative w-full h-[42vh] bg-cover bg-center flex justify-center items-center"
        style={{ backgroundImage: "url('../public/sunnygreen.jpg')" }}
      >
        <div className="absolute inset-0 bg-green-600 opacity-40"></div>
        <div className="relative flex space-x-16">
          <div
            className="relative w-64 text-center p-8 bg-transparent border border-gray-300 rounded-lg shadow-xl backdrop-blur-md transform hover:scale-105 transition-all duration-300 cursor-pointer"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            onClick={scrollToYourCommunities}
          >
            <span className="text-4xl text-white">👥</span>
            <h2 className="text-lg font-semibold mt-4 text-white">
              Your Communities
            </h2>
            <div
              className="absolute bottom-0 right-0 w-16 h-16 bg-white opacity-20 transform rotate-12 origin-bottom-right rounded-bl-lg"
              style={{ clipPath: "polygon(0% 100%, 100% 100%, 100% 0%)" }}
            ></div>
          </div>
          <div
            className="relative w-64 text-center p-8 bg-transparent border border-gray-300 rounded-lg shadow-xl backdrop-blur-md transform hover:scale-105 transition-all duration-300 cursor-pointer"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            onClick={scrollToKnowMoreCommunities}
          >
            <span className="text-4xl text-white">🌐</span>
            <h2 className="text-lg font-semibold mt-4 text-white">
              Know More Communities
            </h2>
            <div
              className="absolute bottom-0 right-0 w-16 h-16 bg-white opacity-20 transform rotate-12 origin-bottom-right rounded-bl-lg"
              style={{ clipPath: "polygon(0% 100%, 100% 100%, 100% 0%)" }}
            ></div>
          </div>
        </div>
      </div>

      {/* Community Listings Section */}
      <div className="p-6 bg-gradient-to-r from-[#D8F3DC] via-[#B7E4C7] via-[#A3D9C6] via-[#BFDCE5] to-[#D6E6F2] min-h-screen overflow-hidden">
        <style>{`::-webkit-scrollbar { display: none; }`}</style>

        {/* Your Communities and Communities You Created Section */}
        <div ref={yourCommunitiesRef} className="space-y-8">
          <h1 className="text-2xl font-bold">Your Communities</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {joinedCommunities.map((community) => (
              <CommunityCard key={community._id} community={community} />
            ))}
          </div>

          <h1 className="text-2xl font-bold">Communities You Created</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {createdCommunities.map((community) => (
              <CommunityCard key={community._id} community={community} />
            ))}
          </div>
        </div>

        {/* Communities You May Like and Popular Communities Section */}
        {/* <div ref={knowMoreCommunitiesRef} className="space-y-8 mt-16">
          <h1 className="text-2xl font-bold">Communities You May Like</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestedCommunities.map((community) => (
              <div key={community.id} className="p-4 border rounded-lg shadow-md flex items-center bg-violet-100">
                <img src={community.image} alt={community.name} className="w-16 h-16 rounded-full mr-4" />
                <div className="flex-1">
                  <h2 className="font-semibold">{community.name}</h2>
                  <p className="text-sm text-gray-600">Theme: {community.theme}</p>
                  <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer" onClick={() => joinCommunity(community)}>Join</button>
                </div>
                <div className="text-right ml-4">
                  <span className="text-lg">👥</span>
                  <p className="text-sm font-semibold">{community.members}</p>
                </div>
              </div>
            ))}
          </div> */}

        <h1 className="p-6 pl-0 text-2xl font-bold">Popular Communities</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {popularCommunities.map((community) => (
            <PopularCommunityCard key={community._id} 
            community={community} 
            joinCommunity={joinCommunity}/>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;

const PopularCommunityCard = ({community , joinCommunity}) => {
  return (
    <div
      className="p-4 border rounded-lg shadow-md flex items-center bg-violet-100"
    >
      <img
        src={community.image}
        alt={community.name}
        className="w-16 h-16 rounded-full mr-4"
      />
      <div className="flex-1">
        <h2 className="font-semibold">{community.name}</h2>
        <p className="text-sm text-gray-600">Theme: {community.theme}</p>
        <button
          className="mt-2 px-4 py-2 bg-purple-500 text-white rounded-lg cursor-pointer"
          onClick={() => joinCommunity(community)}
        >
          Join
        </button>
      </div>
      <div className="text-right ml-4">
        <span className="text-lg">👥</span>
        <p className="text-sm font-semibold text-center">{community.members.length}</p>
      </div>
    </div>
  );
};

const CommunityCard = ({ community }) => {
  return (
    <div className="p-4 border rounded-lg shadow-md flex items-center bg-violet-100">
      <img
        src={community.image}
        alt={community.name}
        className="w-16 h-16 rounded-full mr-4"
      />
      <div className="flex-1">
        <h2 className="font-semibold">{community.name}</h2>
        <p className="text-sm text-gray-600">Theme: {community.theme}</p>
        <Link to={`/community/${community._id}`}>
          <button className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg cursor-pointer">
            Enter
          </button>
        </Link>
      </div>
      <div className="text-right ml-4">
        <span className="text-lg">👥</span>
        <p className=" font-semibold text-md text-center">
          {community.members.length}
        </p>
      </div>
    </div>
  );
};
