import MealOptionCard from "../meal-options/MealOptionCard";
import { useState } from "react";
export default function DraggableMeal({ draggedValueRef, meal,mealOptions }) {
  const [isHovering, setIsHovering] = useState();

  function getMealByName(name) {
    let match = {};
    mealOptions.map((meal) => {
      console.log("MAPPING", meal);
      if (meal.name == name) {
        console.log("mealSomeMatch", meal);
        match = meal;
      }
    });
    console.log("match for name", name, match);
    return match;
  }

  const handleDragStart = (e, name) => {
    console.log("drag start", name);
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
        <div className="list-item">{meal}</div>
      </div>
      {isHovering && (
        <div className="meal-preview">
          <MealOptionCard meal={getMealByName(meal)} previewEnabled={true} />
        </div>
      )}
    </div>
  );
}
