import React, { useEffect } from 'react'
import axios from 'axios'
import { useState } from 'react'
import TemperatureCard from '../components/env components/TemperatureCard';
import BackgroundWithImage from '../homePage/Home';
import BlogCommunityGrid from '../homePage/BlogCommunityGrid';

function HomePage() {
    const [data, setData] = useState([]);

    useEffect(() => {
        document.title = 'Home | EcoPlanet'
        // axios.get(`${import.meta.env.VITE_BACKEND_URL}/`)
        // .then((res) => {
        //     console.log(typeof res.data);
        //     setData(res.data)
        // })
        // .catch((err) => {
        //     console.log(err);
        // })
        // .finally(() => {
        //     console.log('done');
        // });

    }, []);
    return (
        
        <div className='text-center text-5xl'>
            <BackgroundWithImage />
            <BlogCommunityGrid />
            <TemperatureCard temperature={"20"} />
            <code className='text-left text-sm'>
                {data}
            </code>
           
      
        </div>
    )
}

export default HomePage