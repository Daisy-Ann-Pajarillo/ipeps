import React, { useState, useEffect, useRef } from "react";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import SearchIcon from "@mui/icons-material/Search";

const SearchData = ({
  placeholder,
  value,
  onChange,
  className,
  componentData = [],
  onComponentChange,
}) => {
  const [isSearchMode, setIsSearchMode] = useState(true);
  const [searchTerm, setSearchTerm] = useState(value || "");
  const [selectedComponents, setSelectedComponents] = useState(
    componentData.map(() => "")
  );
  const [openFilter, setOpenFilter] = useState(null);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenFilter(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClear = () => {
    setSearchTerm("");
    onChange({ target: { value: "" } });
  };

  const handleOptionSelect = (componentIndex, option) => {
    const updatedComponents = [...selectedComponents];
    updatedComponents[componentIndex] = option;
    setSelectedComponents(updatedComponents);
    onComponentChange(componentIndex, option);
    setOpenFilter(null);
  };

  const handleResetFilters = () => {
    const resetValues = componentData.map(() => "");
    setSelectedComponents(resetValues);
    resetValues.forEach((_, index) => onComponentChange(index, ""));
  };

  const gridStyles = {
    3: "grid-cols-2 sm:grid-cols-3",
    2: "grid-cols-1 sm:grid-cols-2",
    1: "grid-cols-1",
  };

  const gridStyle = gridStyles[componentData.length] || "";

  return (
    <div
      className={`sticky top-0 z-50 w-full flex items-center justify-center bg-white dark:bg-gray-900 shadow-md rounded-lg ${className}`}
    >
      <div className="w-full max-w-3xl flex items-center justify-start gap-3 p-4">
        {componentData.length > 0 && (
          <button
            onClick={() => setIsSearchMode(!isSearchMode)}
            className="px-2 py-1 text-xs w-full max-w-32 font-medium text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            {isSearchMode ? "Switch to Filter" : "Switch to Search"}
          </button>
        )}

        {isSearchMode ? (
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 shadow-sm w-full max-w-xl text-md">
            <SearchIcon className="h-5 w-5 text-gray-400 dark:text-gray-300 mr-2" />
            <input
              type="text"
              placeholder={placeholder || "Search..."}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                onChange(e);
              }}
              className="flex-grow bg-transparent outline-none text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
            />
            {searchTerm && (
              <button
                onClick={handleClear}
                className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        ) : (
          <div className="w-fit max-w-lg flex gap-3 items-center justify-center">
            <div
              className={`min-w-36 w-full max-w-lg grid gap-3 ${gridStyle}`}
              ref={dropdownRef}
            >
              {componentData
                .slice(0, componentData.length)
                .map((component, index) => (
                  <div key={index} className="relative">
                    <span className="absolute -top-2.5 left-3 px-1 bg-white dark:bg-gray-900 text-xs text-gray-500 dark:text-gray-400 z-10">
                      {component.title}
                    </span>
                    <button
                      onClick={() =>
                        setOpenFilter(openFilter === index ? null : index)
                      }
                      className={`w-full min-w-36 px-4 py-2 text-left text-md border transition-colors pt-2 rounded-md
                    ${
                      selectedComponents[index]
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                        : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                    }`}
                    >
                      <span className="block truncate">
                        {selectedComponents[index] || "Select..."}
                      </span>
                    </button>

                    {openFilter === index && (
                      <div className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg">
                        <div className="max-h-60 overflow-auto">
                          {component.options.map((option, optionIndex) => (
                            <button
                              key={optionIndex}
                              onClick={() => handleOptionSelect(index, option)}
                              className={`w-full px-4 py-2 text-left text-sm flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800
                            ${
                              selectedComponents[index] === option
                                ? "text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-900"
                                : "text-gray-700 dark:text-gray-300"
                            }`}
                            >
                              {option}
                              {selectedComponents[index] === option && (
                                <CheckIcon className="h-4 w-4" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
            <button
              onClick={handleResetFilters}
              className="p-2 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-red-500 dark:text-red-400 hover:bg-red-500 dark:hover:bg-red-600 hover:text-white transition"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchData;
