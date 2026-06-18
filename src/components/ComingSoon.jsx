import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
const ComingSoon = () => {
    return (<div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">Coming Soon!</h1>
        <p className="text-xl text-gray-600 mb-8">
          We are currently working hard to bring this feature to you. Stay tuned!
        </p>
        <Link to="/" className="bg-custom-blue hover:bg-[#6B7AFF] text-white px-8 py-3 rounded-lg text-lg font-bold transition-colors">
          Go Back Home
        </Link>
      </div>
    </div>);
};
export default ComingSoon;
