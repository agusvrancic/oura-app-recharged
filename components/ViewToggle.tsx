interface ViewToggleProps {
  viewMode: 'list' | 'board';
  onViewModeChange: (mode: 'list' | 'board') => void;
}

export function ViewToggle({ viewMode, onViewModeChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-3">
      <span className={`text-sm font-medium font-['Geist'] ${viewMode === 'list' ? 'text-black' : 'text-black/40'}`}>
        List
      </span>
      
      {/* Switch Container */}
      <div 
        className="relative w-12 h-6 bg-black rounded-full cursor-pointer transition-colors duration-200"
        onClick={() => onViewModeChange(viewMode === 'list' ? 'board' : 'list')}
      >
        {/* Switch Circle */}
        <div 
          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out ${
            viewMode === 'board' ? 'translate-x-6' : 'translate-x-0.5'
          }`}
        />
      </div>
      
      <span className={`text-sm font-medium font-['Geist'] ${viewMode === 'board' ? 'text-black' : 'text-black/40'}`}>
        Board
      </span>
    </div>
  );
} 