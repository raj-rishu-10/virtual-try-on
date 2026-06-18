import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface TryOnLayoutProps {
  titleText: string;
  selectionTitle: string;
  items: any[];
  selectedItem: any;
  onSelectItem: (item: any) => void;
  renderItem: (item: any, isSelected: boolean) => React.ReactNode;
  children: React.ReactNode;
  otherCategories: { name: string; path: string; icon?: string }[];
  showBeforeAfterBadges?: boolean;
}

const TryOnLayout: React.FC<TryOnLayoutProps> = ({
  titleText,
  selectionTitle,
  items,
  selectedItem,
  onSelectItem,
  renderItem,
  children,
  otherCategories,
  showBeforeAfterBadges = true,
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans pb-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center text-gray-800 font-semibold mb-6 hover:text-custom-blue transition-colors text-sm"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>

        {/* Title */}
        <h1 className="text-center text-4xl md:text-5xl font-bold mb-8 text-gray-600">
          <span className="text-custom-blue">{titleText}</span> Try-On
        </h1>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-sm flex flex-col lg:flex-row overflow-hidden min-h-[600px]">
          
          {/* Left: Camera View */}
          <div className="lg:w-[65%] relative p-4 lg:p-6 flex flex-col">
             <div className="w-full h-full rounded-2xl overflow-hidden relative bg-[#F3F4F6] flex items-center justify-center">
               {showBeforeAfterBadges && (
                 <div className="absolute top-4 left-4 right-4 flex justify-between z-20 pointer-events-none">
                   <div className="bg-black/50 text-white px-3 py-1 rounded-md text-sm font-medium tracking-wide shadow-sm">Before</div>
                   <div className="bg-black/50 text-white px-3 py-1 rounded-md text-sm font-medium tracking-wide shadow-sm">After</div>
                 </div>
               )}
               {children}
             </div>
          </div>

          {/* Right: Controls */}
          <div className="lg:w-[35%] p-6 lg:p-8 flex flex-col border-l border-gray-50">
            
            {/* Selection */}
            <div className="mb-10">
              <h3 className="text-lg font-bold text-gray-800 mb-6">{selectionTitle}</h3>
              <div className="flex flex-wrap gap-4">
                {items.map((item, index) => (
                  <div 
                    key={index} 
                    onClick={() => onSelectItem(item)}
                    className="cursor-pointer transition-transform hover:scale-105"
                  >
                    {renderItem(item, item === selectedItem)}
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-gray-100 my-6" />

            {/* Other Categories */}
            <div className="mt-auto">
               <h3 className="text-md font-bold text-gray-800 mb-4">Try these as well:</h3>
               <div className="space-y-3">
                 {otherCategories.map((cat, idx) => (
                   <Link 
                     key={idx}
                     to={cat.path}
                     className="flex items-center p-4 rounded-xl bg-[#F3F4F6] hover:bg-gray-200 transition-colors"
                   >
                     <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-4 text-xs shadow-sm overflow-hidden flex-shrink-0">
                        {cat.icon ? <img src={cat.icon} alt={cat.name} className="w-full h-full object-cover"/> : <span className="text-gray-400">img</span>}
                     </div>
                     <span className="text-gray-700 font-medium text-sm">{cat.name}</span>
                   </Link>
                 ))}
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TryOnLayout;
