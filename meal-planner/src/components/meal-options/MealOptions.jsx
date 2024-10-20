import "./MealOptions.css";
import AddNewMealOption from "./AddMealOption";
import { useEffect, useState } from "react";
export default function MealOptions({
  draggedValueRef,
  mealOptions,
  setMealOptions,
}) {
  function MealOption({ meal, index }) {
    const handleDragStart = (e, value) => {
      draggedValueRef.current = { value: value, id: index }; // Set the value of the dragged element when dragging starts
    };
    const handleDragEnd = (e) => {
      e.target.style.cursor = "grab"; // Reset the cursor after dragging ends
    };

    return (
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, meal.name)}
        onDragEnd={handleDragEnd}
        style={{ cursor: "grab" }}
        className="meal-option"
      >
        {meal.name}
      </div>
    );
  }

  return (
    <div>
      <h2>Options</h2>
      <AddNewMealOption setMealOptions={setMealOptions} />
      <div className="meal-options-list">
        {mealOptions.map((meal, index) => {
          return <MealOption meal={meal} key={index} index={index} />;
        })}
      </div>
    </div>
  );
}
