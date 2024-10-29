import { useState, useEffect, useRef } from "react";
export default function Dropdown({ listElements, buttonText }) {
  const dropdownRef = useRef(null);
  const btnRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleClickOutside = (event) => {
    if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !btnRef.current.contains(event.target)
      ) {
        console.log("closing2!");
        setIsOpen(false); // Close the popup if clicked outside
      }
  };

  // Add event listener to detect clicks outside of the popup
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <button
        ref={btnRef}
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
      >
        {buttonText}
      </button>
      {isOpen && (
        <div ref={dropdownRef} className="dropdown">
          {listElements}
        </div>
      )}
    </div>
  );
}
