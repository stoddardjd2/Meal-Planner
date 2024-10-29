import { useState, useRef } from "react";
import xIcon from "../assets/x.svg";

export default function CalendarGrid({ mealOptions, draggedValueRef }) {
  const [addedMeals, setAddedMeals] = useState([]);
  const colorOptions = [
    "#264653", // Deep Blue Teal
    "#2A9D8F", // Dark Aqua
    "#E76F51", // Warm Terracotta
    "#F4A261", // Soft Amber
    "#E9C46A", // Golden Yellow
    "#1D3557", // Midnight Blue
    "#457B9D", // Slate Blue
    "#8D99AE", // Gentle Slate
    "#6A4C93", // Rich Purple
    "#FF6F61", // Vibrant Coral
    "#D62828", // Fiery Red
    "#264653", // Deep Blue Green
  ];

  const targetRef2 = useRef(null); // Ref to directly manipulate the DOM content
  const date = new Date();
  const currentDay = date.getDay();

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  function getColor(index) {
    return colorOptions[+index];
  }

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const index = e.currentTarget.id;
    if (targetRef2.current) {
      // targetRef.current.innerText = draggedValueRef.current; // Set the content of the drop target to the dragged value
      setAddedMeals((prev) => {
        // if (prev[dayIndex]) {
        return [
          ...prev,
          {
            ...mealOptions[draggedValueRef.current.id],
            assignment: index,
          },
        ];
        // } else {
        //   return [
        //     {
        //       ...mealOptions[draggedValueRef.current.id],
        //       assignment: index,
        //     },
        //   ];
        // }
      });
    }
  };
  function handleRemoveMeal(e) {
    const index = e.currentTarget.id;
    setAddedMeals((prev) => {
      const copy = [...prev];
      copy.splice(index, 1);
      return copy;
    });
  }

  const mealRow = (meal, index) => {
    let gridItems = [];
    const assignment = meal.assignment;

    for (let i = 0; i < 7; i++) {
      const dayIndex = i;
      if (
        dayIndex == assignment ||
        (dayIndex >= assignment && dayIndex < +assignment + +meal.servings)
      ) {
        gridItems.push(
          <div
            ref={targetRef2} // Attach the ref to the drop target div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            id={i}
            style={{ backgroundColor: `${getColor(index)}` }}
            className="grid-item meal-item-container"
            key={index}
            // className="meal-item-container"
          >
            <div>{meal.name}</div>
            <button id={i} onClick={handleRemoveMeal}>
              <img src={xIcon} />
            </button>
          </div>
        );
      } else {
        gridItems.push(
          <div
            ref={targetRef2} // Attach the ref to the drop target div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            id={i}
            // style={{ backgroundColor: `${getColor(index)}` }}
            className="grid-item"
          >
            {/* {meal.name} */}
          </div>
        );
      }
    }
    return gridItems;
  };

  return (
    <div class="grid-container">
      {days.map((day, index) => {
        return (
          <div className="grid-item-key-container">
            <div
              ref={targetRef2} // Attach the ref to the drop target div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              id={index}
              key={index}
              class="grid-item-key"
            >
              {day}
            </div>
          </div>
        );
      })}

      {addedMeals.map((meal, index) => {
        return mealRow(meal, index);
      })}
    </div>
  );
}
