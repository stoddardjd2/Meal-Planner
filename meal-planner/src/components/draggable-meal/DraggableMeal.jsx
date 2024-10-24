import MealOptionCard from "../meal-options/MealOptionCard";
import { useState } from "react";
import xIcon from "../../assets/x.svg";
export default function DraggableMeal({
  draggedValueRef,
  meal,
  mealOptions,
  elementStyle,
  calendarLocation,
  addedMealIndex,
  showDeleteBtn,
}) {
  const [isHovering, setIsHovering] = useState();

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
    <div className="draggable-item-container">
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, meal)}
        onDragEnd={handleDragEnd}
        className="list-item-container"
        onMouseOver={() => {
          console.log("MOUSE OVER!");
          setIsHovering(true);
        }}
        onMouseLeave={() => {
          console.log("MOUSE LEAVE!");
          setIsHovering();
        }}
      >
        <div style={elementStyle ? elementStyle : {}} className="list-item">
          <div>{meal}</div>
          {showDeleteBtn && (
            <button className="delete-btn">
              <img src={xIcon} />
            </button>
          )}
        </div>
      </div>
      {isHovering && (
        <div className="meal-preview">
          <MealOptionCard meal={getMealByName(meal)} previewEnabled={true} />
        </div>
      )}
    </div>
  );
}
