import foodIcon from "../../assets/food.svg";
import { useState, useRef, useEffect } from "react";
import clockIcon from "../../assets/clock2.svg";
import editIcon from "../../assets/edit.svg";
import openIcon from "../../assets/open.svg";
import Dropdown from "../Dropdown";
import AddNewMealOption from "./AddMealOption";
import dropdownIcon from "../../assets/dropdown.svg";

export default function MealOptionCard({
  meal,
  setMealOptions,
  index,
  draggedValueRef,
}) {
  const [isDropdown, setIsDropdown] = useState(false);
  const popupRef2 = useRef(null); // Reference to the popup element
  const buttonRef2 = useRef(null);
  const [servingSizeMultiplier, setServingSizeMultiplier] = useState(
    meal.multiplier
  );
  const multiplierOptions = [0.5, 1, 2];

  // Handle clicks outside the popup
  const handleClickOutside2 = (event) => {
    if (
      popupRef2.current &&
      !popupRef2.current.contains(event.target) &&
      !buttonRef2.current.contains(event.target)
    ) {
      setIsDropdown(false); // Close the popup if clicked outside
    }
  };

  // Add event listener to detect clicks outside of the popup
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside2);

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside2);
    };
  }, []);

  const handleDragEnd = (e) => {
    e.target.style.cursor = "grab"; // Reset the cursor after dragging ends
  };

  const handleDragStart = (e, name) => {
    console.log("drag start", name);
    draggedValueRef.current = { name }; // Set the value of the dragged element when dragging starts
  };

  console.log("MEAL", meal);
  return (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, meal.name)}
      onDragEnd={handleDragEnd}
      className="meal-option-card"
    >
      <div className="food-container">
        <img src={foodIcon} />
      </div>
      <div className="bottom-card-container">
        <div className="left-side">
          <div className="top-container">
            <div className="card-name">
              {meal.name.charAt(0).toUpperCase() + meal.name.slice(1)}
            </div>
            {meal.cost && <div>${meal.cost}</div>}
          </div>
          {meal.cost && meal.servings && (
            <div>${+meal.cost / meal.servings} / serving</div>
          )}
        </div>
        <div className="right-side">
          <div className="serving-size-multiplier-containerV2">
            {multiplierOptions.map((option, multiplierIndex) => {
              return (
                <button
                  key={multiplierIndex}
                  onClick={(e) => {
                    setMealOptions((prev) => {
                      const copy = [...prev];
                      copy.splice(index, 1, {
                        ...prev[index],
                        multiplier: option,
                      });
                      return copy;
                    });
                    setServingSizeMultiplier(option);
                  }}
                  style={
                    servingSizeMultiplier === option ? {} : { opacity: "60%" }
                  }
                >
                  {`${option == 0.5 ? ".5" : option}x`}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="time-overlay">
        <img src={clockIcon} />
        {console.log("MEAL", meal)}
        {meal.prepTimeMin} Min
      </div>
      <div className="actions-container-overlay">
        <button
          ref={buttonRef2}
          onClick={() =>
            setIsDropdown((prev) => {
              return !prev;
            })
          }
        >
          <img src={editIcon} />
        </button>
        {meal.link && (
          <a href={meal.link} target="_blank">
            <button>
              <img src={openIcon} />
            </button>
          </a>
        )}

        {isDropdown && (
          <div className="popup-container">
            <AddNewMealOption
              popupRef={popupRef2}
              setMealOptions={setMealOptions}
              editMeal={{ index: index, meal: meal }}
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
    </div>
  );
}
