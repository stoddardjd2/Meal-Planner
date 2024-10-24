import { useState } from "react";
import DraggableMeal from "../draggable-meal/DraggableMeal";
import "./CalendarV2.css";
import { useRef } from "react";
export default function CalendarV2({
  draggedValueRef,
  mealOptions,
  addedMeals,
  setAddedMeals,
}) {
  const targetRef = useRef(null); // Ref to directly manipulate the DOM content
  //   const [rows, setRows] = useState([]);
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e, location) => {
    e.preventDefault();
    // const location = e.currentTarget.id;
    const draggedName = draggedValueRef.current.name;
    const draggedLocation = draggedValueRef.current.location;
    const draggedAddedMealIndex = draggedValueRef.current.addedMealIndex;
    let draggedMeal = {};

    mealOptions.some((meal) => {
      // find meal that matches name and exit after finding match
      if (meal.name.toLowerCase() == draggedName.toLowerCase()) {
        draggedMeal = meal;
        return true;
      }
      return false;
    });

    // if target slot occupied, do not add
    const targetSlot = e.currentTarget.id;
    if (targetSlot == "empty") {
      if (draggedLocation) {
        // if dragging an element on calendar, remove old position and then add new\
        console.log("addedMeals", addedMeals);
        setAddedMeals((prev) => {
          const copy = [...prev];
          copy.splice(draggedAddedMealIndex, 1, {
            ...draggedMeal,
            location,
          });
          return copy;
        });
      } else {
        setAddedMeals((prev) => {
          // if (prev[dayIndex]) {
          return [
            ...prev,
            {
              ...draggedMeal,
              location,
            },
          ];
        });
      }
    }
  };

  const rows = ["Morning", "Afternoon", "Evening"];
  const daySlots = 3;
  function getDaySlots(locationXY) {
    const daySlotsElements = [];
    for (let i = 0; i < daySlots; i++) {
      let mealForSlot = {};
      let addedMealIndex;
      let isLastOccupiedSlot = false;
      addedMeals.map((meal, mealIndex) => {
        //check if slot in range, calculated by dropped slot and serving size
        let value = locationXY.column;
        let min = meal.location.column;
        let max = meal.location.column - 1 + meal.servings * meal.multiplier;
        const inRange = value >= min && value <= max;
        const isSlotOccupied =
          inRange &&
          meal.location.row == locationXY.row &&
          meal.location.slot == i;
        if (isSlotOccupied) {
          mealForSlot = meal;
          addedMealIndex = mealIndex;
          //show delete btn if last slot for meal group or if on last day in case cut off
          isLastOccupiedSlot =
            max == locationXY.column || locationXY.column == days.length - 1
              ? true
              : false;

          return true;
        } else {
          return false;
        }
      });

      //   for occupied slot:
      if (!(Object.keys(mealForSlot).length == 0)) {
        daySlotsElements.push(
          <div
            ref={targetRef} // Attach the ref to the drop target div
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, { ...locationXY, slot: i })}
            id={"taken"}
            className="slot-item"
          >
            <DraggableMeal
              draggedValueRef={draggedValueRef}
              meal={mealForSlot.name}
              mealOptions={mealOptions}
              elementStyle={{ width: "100%" }}
              calendarLocation={{ ...locationXY, slot: i }}
              addedMealIndex={addedMealIndex}
              showDeleteBtn={isLastOccupiedSlot}
            />
          </div>
        );
      } else {
        // for emtpy slot:
        daySlotsElements.push(
          <div
            ref={targetRef} // Attach the ref to the drop target div
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, { ...locationXY, slot: i })}
            id="empty"
            className="slot-item"
          >
            Slot {i}
          </div>
        );
      }
    }
    return daySlotsElements;
  }

  return (
    <div className="CalendarV2">
      {
        <div className="calendarv2--row">
          {days.map((day, index) => {
            return (
              <div className="calendarv2--column-key" key={index}>
                {day} {index}
              </div>
            );
          })}
          <div className="calendarv2--extra-meals"></div>
        </div>
      }
      {rows.map((row, rowIndex) => {
        return (
          <div key={rowIndex} className="calendarv2--row calendarv2--row-value">
            <div className="calendarv2--row-key">
              {row}-{rowIndex}
            </div>
            {days.map((day, columnIndex) => {
              return (
                <div className="calendarv2--item-value" key={columnIndex}>
                  {getDaySlots({ row: rowIndex, column: columnIndex })}
                </div>
              );
            })}

            <div className="calendarv2--extra-meals">+4</div>
          </div>
        );
      })}
    </div>
  );
}
