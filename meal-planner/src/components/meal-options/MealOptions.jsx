import "./MealOptions.css";
import AddNewMealOption from "./AddMealOption";
import { useEffect, useState, useRef } from "react";
import xIcon from "../../assets/x.svg";
import clockIcon from "../../assets/clock.svg";
import Dropdown from "../Dropdown";
import servingsIcon from "../../assets/meal.svg";
import dropdownIcon from "../../assets/dropdown.svg";
import plusIcon from "../../assets/plus.svg";
import MealOptionCard from "./MealOptionCard";
export default function MealOptions({
  draggedValueRef,
  mealOptions,
  setMealOptions,
  mealNamesSearch,
}) {
  const [isDropdown, setIsDropdown] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const popupRef = useRef(null); // Reference to the popup element
  const buttonRef = useRef(null);
  const popupRef2 = useRef(null); // Reference to the popup element
  const buttonRef2 = useRef(null);

  function handleToggleIsAdding(e) {
    // e.stopPropagation()
    if (e.currentTarget.id === "isAddingButton") {
      setIsAdding((prev) => !prev);
    }
  }

  // Handle clicks outside the popup
  const handleClickOutside = (event) => {
    if (
      popupRef.current &&
      !popupRef.current.contains(event.target) &&
      !buttonRef.current.contains(event.target)
    ) {
      setIsAdding(false); // Close the popup if clicked outside
    } else if (
      popupRef2.current &&
      !popupRef2.current.contains(event.target) &&
      !buttonRef2.current.contains(event.target)
    ) {
      setIsDropdown(false); // Close the popup if clicked outside
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
    <div className="mealOptions">
      <div className="meal-options-grid">
        <button
          ref={buttonRef2}
          onClick={() =>
            setIsDropdown((prev) => {
              return !prev;
            })
          }
          className="add-meal-btn"
        >
          Add a Meal
        </button>

        {mealOptions.map((meal, index) => {
          if (mealNamesSearch) {
            // filter by search if search given
            if (mealNamesSearch.includes(meal.name)) {
              return (
                <MealOptionCard
                  mealOptions={mealOptions}
                  meal={meal}
                  key={meal.name}
                  index={index}
                  setMealOptions={setMealOptions}
                  draggedValueRef={draggedValueRef}
                />
              );
            }
          } else {
            // display all cards
            return (
              <MealOptionCard
                mealOptions={mealOptions}
                meal={meal}
                key={meal.name}
                index={index}
                setMealOptions={setMealOptions}
                draggedValueRef={draggedValueRef}
              />
            );
          }
        })}
        {isDropdown && (
          <div className="popup-container">
            <AddNewMealOption
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

      {/* <div className="meal-options-list">
        {mealOptions.map((meal, index) => {
          return (
            <MealOption
              meal={meal}
              key={meal.name}
              index={index}
              setMealOptions={setMealOptions}
              draggedValueRef={draggedValueRef}
            />
          );
        })}

        <div className="actions-container">
          <button
            ref={buttonRef}
            id={"isAddingButton"}
            onClick={handleToggleIsAdding}
            // className="add-button"
          >
            <div>Add a Meal</div>
            <img src={plusIcon} />
          </button>
          {isAdding && (
            <AddNewMealOption
              popupRef={popupRef}
              setMealOptions={setMealOptions}
            />
          )}
        </div>
      </div> */}
    </div>
  );
}

function MealOption({ meal, index, setMealOptions, draggedValueRef }) {
  const [isDropdown, setIsDropdown] = useState(false);
  const [servingSizeMultiplier, setServingSizeMultiplier] = useState(1);
  const popupRef2 = useRef(null); // Reference to the popup element
  const buttonRef2 = useRef(null);
  // const ingredientsRef = useRef(null);
  // const ingredientsBtnRef = useRef(null);
  const multiplierOptions = [0.5, 1, 2];
  const handleDragStart = (e, name) => {
    draggedValueRef.current = { name }; // Set the value of the dragged element when dragging starts
  };
  const handleDragEnd = (e) => {
    e.target.style.cursor = "grab"; // Reset the cursor after dragging ends
  };

  function handleDropdownToggle() {
    setIsDropdown((prev) => !prev);
  }

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

  return (
    <div className="dropdown-container">
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, meal.name)}
        onDragEnd={handleDragEnd}
        className="meal-option"
      >
        <button
          onClick={handleDropdownToggle}
          className="dropdown-button"
          ref={buttonRef2}
        >
          <img src={dropdownIcon} />
        </button>
        <div>{meal.name}</div>

        {meal.cost && meal.servings && (
          <>
            <div>-</div>
            <div>
              ${+meal.cost / meal.servings}
              /serving
            </div>
          </>
        )}
        {meal?.prepTimeMin && (
          <>
            <div>-</div>
            <div className="flex-box">
              <img src={clockIcon} />

              <div>{meal.prepTimeMin} min</div>
            </div>
          </>
        )}
        <>
          <div>-</div>
          {meal.servings && (
            <div className="flex-box">
              <img src={servingsIcon} />
              <div> {+meal.servings * servingSizeMultiplier} servings</div>
            </div>
          )}
          <div className="serving-size-multiplier-container">
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
                    servingSizeMultiplier === option
                      ? { outline: "2px white solid" }
                      : {}
                  }
                >
                  {`${option == 0.5 ? ".5" : option}x`}
                </button>
              );
            })}
          </div>
        </>
        {meal.cost && (
          <>
            <div>-</div>
            <div className="meal-cost">
              ${meal.servings ? +meal.cost * +meal.multiplier : +meal.cost}
              {/* if no servings selected, do not use multiplier*/}
            </div>
          </>
        )}
        <button className="exit-button">
          <img className="x-icon" src={xIcon} />
        </button>
      </div>
      {isDropdown && (
        // <div className="dropdown">
        <AddNewMealOption
          popupRef={popupRef2}
          setMealOptions={setMealOptions}
          editMeal={{ index: index, meal: meal }}
          setIsDropdown={setIsDropdown}
        />
        // </div>
      )}
    </div>
  );
}
