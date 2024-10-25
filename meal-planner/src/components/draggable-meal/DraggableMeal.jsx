import MealOptionCard from "../meal-options/MealOptionCard";
import { useState } from "react";
import xIcon from "../../assets/x.svg";
export default function DraggableMeal({
  draggedValueRef,
  meal,
  mealOptions,
  elementStyle,
  calendarLocation,
  // Only Requre if on calendar:
  addedMealIndex,
  showDeleteBtn,
  setAddedMeals,
  hideName,
  mainElement,
}) {
  const [isHovering, setIsHovering] = useState(false);
  const [isHoveringBtn, setIsHoveringBtn] = useState(false);
  function getMealByName(name) {
    let match = {};
    mealOptions.map((meal) => {
      if (meal.name == name) {
        match = meal;
      }
    });
    return match;
  }

  const handleDragStart = (e, name) => {
    setIsHovering(false);
    draggedValueRef.current = calendarLocation
      ? { name, location: calendarLocation, addedMealIndex }
      : { name }; // Set the value of the dragged element when dragging starts
  };
  const handleDragEnd = (e) => {
    // e.target.style.cursor = "grab"; // Reset the cursor after dragging ends
  };

  return (
    <div
      onMouseOver={() => {
        console.log("HVOERING CONTRAINER")
        setIsHovering(true);
      }}
      onMouseLeave={() => {
        setIsHovering(false);
      }}
      className="draggable-item-container"
    >
      <div
        className="list-item-container"
        draggable
        onDragStart={(e) => handleDragStart(e, meal)}
        onDragEnd={handleDragEnd}
      >
        <div style={elementStyle ? elementStyle : {}} className="list-item">
          {hideName ? <div></div> : mainElement ? mainElement : meal}
          {/* hide name if set */}
        </div>
        {showDeleteBtn && (
          <button
            onMouseOver={() => {
              setIsHoveringBtn(true);
            }}
            onMouseLeave={() => {
              setIsHoveringBtn(false);
            }}
            onClick={() => {
              setAddedMeals((prev) => {
                const copy = [...prev];
                copy.splice(addedMealIndex, 1);
                return copy;
              });
            }}
            className="delete-btn"
          >
            <img src={xIcon} />
          </button>
        )}
      </div>
      {isHovering && !isHoveringBtn && (
        <div className="meal-preview">
          <MealOptionCard meal={getMealByName(meal)} previewEnabled={true} />
        </div>
      )}
    </div>
  );
}
