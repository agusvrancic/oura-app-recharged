export function EmptyState() {
  return (
    <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center">
      {/* Illustration without + icon */}
      <div className="mb-6">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Note/Paper background */}
          <rect x="16" y="12" width="48" height="56" rx="8" fill="#F9FAFB" stroke="#E5E7EB" strokeWidth="1"/>
          
          {/* Shadows for depth */}
          <rect x="20" y="16" width="48" height="56" rx="8" fill="#F3F4F6" opacity="0.6"/>
          <rect x="24" y="20" width="48" height="56" rx="8" fill="white" stroke="#E5E7EB" strokeWidth="1"/>
          
          {/* Text lines */}
          <rect x="32" y="52" width="24" height="2" rx="1" fill="#D1D5DB"/>
          <rect x="32" y="58" width="20" height="2" rx="1" fill="#D1D5DB"/>
          <rect x="32" y="64" width="16" height="2" rx="1" fill="#D1D5DB"/>
        </svg>
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 font-dm-sans">No tasks</h3>
      <p className="mt-1 text-sm text-gray-500 font-dm-sans">
        Add tasks to get started
      </p>
    </div>
  );
} 