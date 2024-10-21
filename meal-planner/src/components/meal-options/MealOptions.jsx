import "./MealOptions.css";
import AddNewMealOption from "./AddMealOption";
import { useEffect, useState } from "react";
import xIcon from "../../assets/x.svg";

export default function MealOptions({
  draggedValueRef,
  mealOptions,
  setMealOptions,
}) {
  const [isAdding, setIsAdding] = useState(false);
  function handleToggleIsAdding(e) {
    // e.stopPropagation()
    if (e.target.id === "isAddingButton") {
      setIsAdding((prev) => !prev);
    }
  }

  return (
    <div>
      <h2>Options</h2>
      <div>
        <button id={"isAddingButton"} onClick={handleToggleIsAdding}>
          Add
        </button>
        {isAdding && <AddNewMealOption setMealOptions={setMealOptions} />}
      </div>
      <div className="meal-options-list">
        {mealOptions.map((meal, index) => {
          return (
            <MealOption
              meal={meal}
              key={index}
              index={index}
              setMealOptions={setMealOptions}
              draggedValueRef={draggedValueRef}
            />
          );
        })}
      </div>
    </div>
  );
}

function MealOption({ meal, index, setMealOptions, draggedValueRef }) {
  const [isDropdown, setIsDropdown] = useState(false);
  const handleDragStart = (e, value) => {
    draggedValueRef.current = { value: value, id: index }; // Set the value of the dragged element when dragging starts
  };
  const handleDragEnd = (e) => {
    e.target.style.cursor = "grab"; // Reset the cursor after dragging ends
  };

  function handleDropdownToggle() {
    setIsDropdown((prev) => !prev);
  }

  return (
    <div className="dropdown-container">
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, meal.name)}
        onDragEnd={handleDragEnd}
        style={{ cursor: "grab" }}
        className="meal-option"
      >
        <button
          onClick={handleDropdownToggle}
          className="dropdown-button"
        ></button>
        <div>{meal.name}</div>
        <button className="exit-button">
          <img className="x-icon" src={xIcon} />
        </button>
      </div>
      {isDropdown && (
        // <div className="dropdown">
        <AddNewMealOption
          setMealOptions={setMealOptions}
          editMeal={{ index: index, meal: meal }}
          setIsDropdown={setIsDropdown}
        />
        // </div>
      )}
    </div>
  );
}
