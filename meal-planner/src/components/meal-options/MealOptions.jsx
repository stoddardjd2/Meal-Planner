import "./MealOptions.css";
import { useEffect, useState, useRef } from "react";
import MealOptionCard from "./MealOptionCard";
import AddMealBtn from "../AddMealBtn";
export default function MealOptions({
  draggedValueRef,
  mealOptions,
  setMealOptions,
  mealNamesSearch,
  assignments,
}) {
  return (
    <div className="mealOptions">
      <div className="meal-option-cards-grid">
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
                  // assignments={assignments}
                  styling={{
                    backgroundColor: `${assignments[meal.name].color}`,
                  }}
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
                // assignments={assignments}
                styling={{ backgroundColor: `${assignments[meal.name].color}` }}
              />
            );
          }
        })}
      </div>
    </div>
  );
}
