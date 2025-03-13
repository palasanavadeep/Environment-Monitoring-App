import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import { Pagination, Autoplay, EffectCoverflow } from "swiper/modules";
import { Sparkles, Star, Globe, Leaf, CloudRain, Sun, Wind, ShieldCheck } from "lucide-react";

export default function WhyUsSwiper() {
  const features = [
    {
      title: "Beyond Weather Monitoring",
      description: "We go beyond forecasts—helping protect the environment with actionable insights and eco-friendly initiatives."
    },
    {
      title: "Community Driven Solutions",
      description: "Engage with a like-minded community to report environmental issues and take meaningful action together."
    },
    {
      title: "Sustainable Alerts",
      description: "Get alerts not just about weather changes, but also about sustainable actions to reduce climate impact."
    },
    {
      title: "AI-Powered Insights",
      description: "Harness AI-driven analytics for real-time weather impact predictions and sustainability recommendations."
    },
    {
      title: "Missions & Rewards",
      description: "Participate in environmental missions, earn rewards, and make a difference—one step at a time."
    },
    {
      title: "Educational Blogs",
      description: "Explore expert insights on climate change, sustainability, and eco-friendly living."
    }
  ];

  return (
    <div className="bg-[#0F172A] p-6 rounded-xl shadow-lg w-full h-full text-white flex flex-col items-center border border-gray-700 relative overflow-hidden">
      {/* Floating Icons */}
      <div className="absolute top-5 left-5 text-blue-400 opacity-30 animate-pulse">
        <Globe size={60} />
      </div>
      <div className="absolute top-10 right-5 text-yellow-300 opacity-30 animate-pulse">
        <Sun size={50} />
      </div>
      <div className="absolute bottom-5 left-5 text-gray-300 opacity-30 animate-pulse">
        <CloudRain size={50} />
      </div>
      <div className="absolute bottom-10 right-5 text-blue-400 opacity-30 animate-pulse">
        <Wind size={50} />
      </div>

      {/* Section Title */}
      <div className="flex items-center gap-4 mb-5">
        <Sparkles size={30} className="text-yellow-300 animate-bounce" />
        <h2 className="text-3xl font-bold text-gray-200">Our Unique Impact</h2>
        <Star size={30} className="text-blue-300 animate-bounce" />
      </div>

      {/* Swiper */}
      <Swiper
        modules={[Pagination, Autoplay, EffectCoverflow]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        effect="coverflow"
        centeredSlides={true}
        coverflowEffect={{ rotate: 30, stretch: 0, depth: 100, modifier: 1, slideShadows: true }}
        spaceBetween={10}
        slidesPerView={1}
        className="h-[300px] w-full"
      >
        {features.map((feature, index) => (
          <SwiperSlide key={index} className="p-6 bg-white rounded-xl shadow-lg flex flex-col items-center justify-center text-center text-gray-900 transition-transform duration-500 hover:scale-105 border border-gray-600 relative overflow-hidden">
            <div className="absolute top-3 right-3 text-green-500">
              <ShieldCheck size={30} />
            </div>
            <h3 className="text-xl font-bold text-green-700">{feature.title}</h3>
            <p className="text-gray-700 text-sm leading-relaxed mt-2">{feature.description}</p>
            <Leaf size={28} className="text-green-500 mt-3 animate-spin-slow" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
