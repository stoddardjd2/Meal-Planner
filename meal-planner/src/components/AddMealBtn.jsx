import { useState, useEffect, useRef } from "react";
import AddMealOption from "./meal-options/AddMealOption";
import plusIcon from '../assets/plus.svg'
export default function AddMealBtn({mealOptions, setMealOptions}) {
  const popupRef2 = useRef(null); // Reference to the popup element
  const buttonRef2 = useRef(null);
  const [isDropdown, setIsDropdown] = useState(false);
  // Handle clicks outside the popup
  // Add event listener to detect clicks outside of the popup
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    // if (
    //   popupRef.current &&
    //   !popupRef.current.contains(event.target) &&
    //   !buttonRef.current.contains(event.target)
    // ) {
    //   setIsAdding(false); // Close the popup if clicked outside
    // } else
    if (
      popupRef2.current &&
      !popupRef2.current.contains(event.target) &&
      !buttonRef2.current.contains(event.target)
    ) {
      setIsDropdown(false); // Close the popup if clicked outside
    }
  };

  return (
    <div className="AddMealBtn">
      <button 
        ref={buttonRef2}
        onClick={() => setIsDropdown(true)}
        className="add-meal-btn"
      >
        <img src={plusIcon}/>
      </button>
      {isDropdown && (
        <div className="popup-container">
          <AddMealOption
            mealOptions={mealOptions}
            popupRef={popupRef2}
            setMealOptions={setMealOptions}
            // editMeal={{ index: index, meal: meal }}
            setIsDropdown={setIsDropdown}
            styling={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>
      )}
    </div>
  );
}
