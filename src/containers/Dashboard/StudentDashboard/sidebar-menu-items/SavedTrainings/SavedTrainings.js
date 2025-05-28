// ...existing imports...

const SavedTrainings = () => {
  // ...existing state and functions...

  return (
    <div className="min-h-screen w-full">
      // ...existing header and search sections...

      {/* Main Content Layout */}
      <div className="flex flex-col-reverse lg:flex-row gap-4 md:gap-8 px-1 sm:px-2 md:px-4 py-2 w-full max-w-[1800px] mx-auto flex-1 overflow-hidden">
        {/* Training List Section */}
        // ...existing list section...

        {/* Desktop View */}
        {selectedTraining && (
          <div className="hidden lg:block w-full lg:w-[600px] xl:w-[800px] flex-shrink-0 sticky top-4" 
               style={{ zIndex: 1000 }}>
            <SavedTrainingsView 
              // ...existing props...
            />
          </div>
        )}

        {/* Mobile View */}
        {selectedTraining && (
          <div 
            className="lg:hidden fixed inset-0"
            style={{ zIndex: Number.MAX_SAFE_INTEGER }}
          >
            <div 
              className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm"
              style={{ 
                position: 'fixed',
                zIndex: Number.MAX_SAFE_INTEGER,
                pointerEvents: 'auto'
              }}
            >
              // ...rest of mobile modal structure...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedTrainings;
