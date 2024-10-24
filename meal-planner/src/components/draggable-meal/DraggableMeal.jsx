import MealOptionCard from "../meal-options/MealOptionCard";
import { useState } from "react";
export default function DraggableMeal({
  draggedValueRef,
  meal,
  mealOptions,
  elementStyle,
}) {
  const [isHovering, setIsHovering] = useState();
  console.log("MEAL", meal);

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
    draggedValueRef.current = { name }; // Set the value of the dragged element when dragging starts
  };
  const handleDragEnd = (e) => {
    e.target.style.cursor = "grab"; // Reset the cursor after dragging ends
  };

  return (
    <div className="draggable-item-container">
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, meal)}
        onDragEnd={handleDragEnd}
        className="list-item-container"
        onMouseOver={() => {
          setIsHovering(!isHovering);
        }}
        onMouseLeave={() => {
          setIsHovering();
        }}
      >
        {console.log("STYLE", elementStyle)}
        <div style={elementStyle ? elementStyle : {}} className="list-item">
          {meal}
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
