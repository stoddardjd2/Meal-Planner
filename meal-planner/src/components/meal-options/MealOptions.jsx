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
  setIsDropdown,
  isDropdown,
}) {

  return (
    <div className="mealOptions">
      <div className="meal-option-cards-grid">
        <div className="sticky" style={{ marginRight: "3px", zIndex: "5" }}>
          <AddMealBtn
            mealOptions={mealOptions}
            setMealOptions={setMealOptions}
          />
        </div>
        {mealOptions.map((meal, index) => {
          if (mealNamesSearch) {
            // filter by search if search given
            if (mealNamesSearch.includes(meal.name)) {
              return (
                <MealOptionCard
                  setIsDropdown={setIsDropdown}
                  isDropdown={isDropdown}
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
            // display all cardss
            return (
              <MealOptionCard
                setIsDropdown={setIsDropdown}
                isDropdown={isDropdown}
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
