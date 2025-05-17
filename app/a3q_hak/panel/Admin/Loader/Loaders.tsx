import React from 'react';
import './loader.css';
interface LoaderProps {
    colours: string; 
  }
const Loader: React.FC = () => {
    return (
        <div className="flex py-[20px] rev h-[90px] mt-[30px] opacity-50">
            <div className={`bg-blue-700`} id='bar1'></div>
            <div className={`bg-blue-700`}id='bar2'> </div>
        </div>
    );
};

export default Loader;
