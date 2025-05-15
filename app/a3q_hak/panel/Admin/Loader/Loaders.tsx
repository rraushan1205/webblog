import React from 'react';
import './loader.css';
interface LoaderProps {
    colours: string; 
  }
const Loader: React.FC <LoaderProps> = ({colours}) => {
    return (
        <div className="flex py-[20px] rev h-[90px] mt-[30px] opacity-50">
            <div className={`bg-${colours}-700`} id='bar1'></div>
            <div className={`bg-${colours}-700`}id='bar2'> </div>
        </div>
    );
};

export default Loader;
