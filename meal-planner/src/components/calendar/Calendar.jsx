import "./Calendar.css";
import { useState, useRef } from "react";
import xIcon from "../../assets/x.svg";
export default function Calendar({ mealOptions, draggedValueRef }) {
  const [addedMeals, setAddedMeals] = useState([
    // {
    //   name: "Burger",
    //   link: "",
    //   servings: 2,
    //   prepTimeMin: 25,
    //   ingredients: ["onions", "buns", "patty"],
    //   assignment: 1,
    // },
    // {
    //   name: "tortilla wrap",
    //   link: "",
    //   servings: 2,
    //   prepTimeMin: 10,
    //   ingredients: ["tortilla", "meat"],
    //   assignment: 3,
    // },
  ]);
  const [days, setDays] = useState([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ]);
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
              setDays={setDays}
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
  setDays,
  dayIndex,
  draggedValueRef,
  setAddedMeals,
  addedMeals,
  mealOptions,
}) {
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

  const targetRef = useRef(null); // Ref to directly manipulate the DOM content
  const date = new Date();
  const currentDay = date.getDay();

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const index = e.currentTarget.id;
    const draggedMeal = mealOptions[draggedValueRef.current.id];
    if (targetRef.current && index <= 6) {
      if (+index + +draggedMeal.servings > 7) {
        // add additional columns if meals overflow
        const total = +index + +draggedMeal.servings - 7;
        setDays((prev) => {
          console.log("setting days");
          for (let i = 0; i > total; i++) {}
          return [...prev, "+"];
        });
      }
      // targetRef.current.innerText = draggedValueRef.current; // Set the content of the drop target to the dragged value
      setAddedMeals((prev) => {
        // if (prev[dayIndex]) {
        return [
          ...prev,
          {
            index: draggedValueRef.current.id,
            assignment: index,
          },
        ];
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
  function getColor(index) {
    return colorOptions[+index];
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
        <>
          {addedMeals.map((meal, index) => {
            const assignment = meal.assignment;
            if (
              dayIndex == assignment ||
              (dayIndex >= assignment &&
                dayIndex < +assignment + +mealOptions[meal.index].servings)
            ) {
              // if (+assignment + +meal.servings > 7) {
              //   console.log("over 7, placing at front");
              //   return <div>test</div>;
              // }
              return (
                <div
                  style={{
                    backgroundColor: `${getColor(index)}`,
                  }}
                  key={index}
                  className="meal-item-container"
                >
                  {console.log("options", mealOptions)}
                  <div>{mealOptions[meal.index].name}</div>
                  <button id={index} onClick={handleRemoveMeal}>
                    <img src={xIcon} />
                  </button>
                </div>
              );
            } else {
              return <div className="hidden-text">hidden</div>;
            }
          })}
        </>
      </div>
    </div>
  );
}
