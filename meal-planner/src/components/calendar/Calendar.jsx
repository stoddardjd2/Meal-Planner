import "./Calendar.css";
import { useState, useRef } from "react";
import xIcon from "../../assets/x.svg";
export default function Calendar({ mealOptions, draggedValueRef }) {
  const [addedMeals, setAddedMeals] = useState({
    1: [
      {
        name: "Burger",
        link: "",
        servings: 4,
        prepTimeMin: 25,
        ingredients: ["onions", "buns", "patty"],
      },
      {
        name: "tortilla wrap",
        link: "",
        servings: 2,
        prepTimeMin: 10,
        ingredients: ["tortilla", "meat"],
      },
    ],
  });

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  return (
    <div className="calendar-container">
      {days.map(
        (day, index) => {
          return (
            <Day
              mealOptions={mealOptions}
              draggedValueRef={draggedValueRef}
              day={day}
              key={index}
              dayIndex={index}
              setAddedMeals={setAddedMeals}
              addedMeals={addedMeals}
            />
          );
        }
        // id corresponds to current day (0-6)
      )}
    </div>
  );
}

function Day({
  day,
  dayIndex,
  draggedValueRef,
  setAddedMeals,
  addedMeals,
  mealOptions,
}) {
  const targetRef = useRef(null); // Ref to directly manipulate the DOM content
  const date = new Date();
  const currentDay = date.getDay();

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (targetRef.current) {
      // targetRef.current.innerText = draggedValueRef.current; // Set the content of the drop target to the dragged value
      setAddedMeals((prev) => {
        if (prev[dayIndex]) {
          return {
            ...prev,
            [dayIndex]: [
              ...prev[dayIndex],
              mealOptions[draggedValueRef.current.id],
            ],
          };
        } else {
          return {
            ...prev,
            [dayIndex]: [mealOptions[draggedValueRef.current.id]],
          };
        }
      });
    }
  };
  function handleRemoveMeal(e) {
    const index = e.currentTarget.id;
    setAddedMeals((prev) => {
      const copy = [...prev[dayIndex]];
      copy.splice(index, 1);
      return { ...prev, [dayIndex]: copy };
    });
  }

  return (
    <div
      ref={targetRef} // Attach the ref to the drop target div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      id={dayIndex}
    >
      <div style={dayIndex === currentDay ? { backgroundColor: "green" } : {}}>
        {day}
      </div>
      <div className="added-meals-list">
        {!addedMeals[dayIndex] || addedMeals[dayIndex].length == 0 ? (
          <div className="placeholder-text">Empty</div>
        ) : (
          <>
            {addedMeals[dayIndex].map((meal, index) => {
              return (
                <div key={index} className="meal-item-container">
                  <div>{meal.name}</div>
                  <button id={index} onClick={handleRemoveMeal}>
                    <img src={xIcon} />
                  </button>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
