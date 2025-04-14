
import React from 'react';
import { Loader2 } from 'lucide-react';
import '../../styles/app-loader.css'

const AppLoader = () => {
  return (
    <div className="app-loader-container">
      <div className="loader-content">
        <Loader2 className="spinning-icon" size={48} strokeWidth={2} />
      </div>
    </div>
  );
};

export default AppLoader;
