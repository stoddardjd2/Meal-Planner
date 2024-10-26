import { useEffect, useState } from "react";
import DraggableMeal from "../draggable-meal/DraggableMeal";
import "./CalendarV2.css";
import { useRef } from "react";
export default function CalendarV2({
  draggedValueRef,
  mealOptions,
  addedMeals,
  setAddedMeals,
  assignments,
}) {
  const [isCompactMode, setIsCompactMode] = useState(true);
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
  // useEffect(() => {
  //   fetch("https://api.iconify.design/axe/", {
  //     method: "GET", // Use "POST", "PUT", or "DELETE" as needed
  //     headers: {
  //       "Content-Type": "application/json", // Adjust as needed, e.g., for JSON or form data
  //     },
  //   })
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! Status: ${response.status}`);
  //       }
  //       return response.json(); // Parse JSON data (use response.text() for plain text)
  //     })
  //     .then((data) => {
  //       // Process and display the data as needed
  //     })
  //     .catch((error) => {
  //     });
  // }, []);vv
  //   let overFlowCount = { 0: 0, 1: 0, 2: 2 };
  //   const [overflowCount, setOverFlowCount] = useState({ 0: 0, 1: 0, 2: 2 });
  //   morning, afternoon, evening
  console.log("addedMeals!", addedMeals);

  function getOverflowForRow(rowIndex) {
    if (!(addedMeals.length == 0)) {
      let overflowCount = 0;
      addedMeals.map((meal, index) => {
        overflowCount = Number.isInteger(meal.overflow[rowIndex])
          ? overflowCount + meal.overflow[rowIndex]
          : overflowCount;
      });
      return overflowCount;
    }
  }
  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e, location) => {
    e.preventDefault();
    // const location = e.currentTarget.id;
    // const draggedName = draggedValueRef.current.name;
    const draggedLocation = draggedValueRef.current.location;
    console.log("LOCATIUON", draggedLocation);
    const draggedAddedMealIndex = draggedValueRef.current.addedMealIndex;
    console.log("draggedValueRef.current", draggedValueRef.current);
    const draggedIsFirst = draggedValueRef.current.isFirst;
    const draggedMeal = draggedValueRef.current.meal;

    let rowOverflowLength = 0;

    // if target slot occupied, do not add
    const targetSlot = e.currentTarget.id;
    if (targetSlot == "empty") {
      // update overflow length for row if overflows
      const wholeLength = Math.ceil(
        draggedMeal.servings * draggedMeal?.multiplier
      );

      if (location.column + wholeLength > 7) {
        rowOverflowLength = location.column + wholeLength - days.length;
      }
      // const isFirstOccupiedSlot = min == location.column ? true : false;
      // if dragging first slot of meal, move entire group
      if (draggedLocation) {
        // if dragging an element on calendar
        if (!draggedIsFirst) {
          // if not first item and dragged, remove dragged and place to dragged spot.
          //update data with new positions to compensate for break
          setAddedMeals((prev) => {
            // update original meal to be 1 less
            const originalCostUpdated = +(
              (+(+draggedMeal.servings - 1) / +draggedMeal.servings) *
              +draggedMeal.cost
            ).toFixed(2);
            const newCost = +(
              (1 / +draggedMeal.servings) *
              +draggedMeal.cost
            ).toFixed(2);
            const copy = [...prev];
            copy.splice(draggedAddedMealIndex, 1, {
              ...draggedMeal,
              servings: draggedMeal.servings - 1,
              cost: originalCostUpdated,
            });
            return [
              ...copy,
              {
                ...draggedMeal,
                servings: 1,
                overflow: 0,
                location,
                cost: newCost,
              },
            ];
          });
        } else {
          // if  dragging first element on calendar, remove old position and then add new
          setAddedMeals((prev) => {
            const copy = [...prev];
            copy.splice(draggedAddedMealIndex, 1, {
              ...draggedMeal,
              location,
              overflow: { [location.row]: rowOverflowLength },
            });
            return copy;
          });
        }
      } else {
        setAddedMeals((prev) => {
          // if (prev[dayIndex]) {
          return [
            ...prev,
            {
              ...draggedMeal,
              location,
              overflow: { [location.row]: rowOverflowLength },
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
      let isFirstOccupiedSlot = false;
      let percentage;
      let isOverlapping = false;
      addedMeals.map((meal, mealIndex) => {
        //check if slot in range, calculated by dropped slot and serving size
        let value = locationXY.column;
        let min = meal.location.column;
        // if servings not set, default to 1
        const columnLength = meal.servings
          ? meal.servings * meal.multiplier
          : 1 * meal.multiplier;
        //   round up so always take up a slot and visually change slot to show percentage
        let columnRoundedUp = Math.ceil(columnLength);
        let max = meal.location.column - 1 + columnRoundedUp;
        const inRange = value >= min && value <= max;
        const isSlotOccupied =
          inRange &&
          meal.location.row == locationXY.row &&
          meal.location.slot == i;
        if (isSlotOccupied) {
          percentage =
            (columnLength - Math.floor(columnLength)).toFixed(2) * 100;
          mealForSlot = meal;
          addedMealIndex = mealIndex;
          //show delete btn if last slot for meal group or if on last day in case cut off
          isLastOccupiedSlot =
            max == locationXY.column || locationXY.column == days.length - 1
              ? true
              : false;
          isFirstOccupiedSlot = min == locationXY.column ? true : false;
        } else {
        }

        //if any non-first slot in meal length has another slot within it, then skip to next empty slot
        // NOT ADDED YET!
      });

      if (!(Object.keys(mealForSlot).length == 0)) {
        //   for any occupied slot:
        console.log("OCCUPIED");
        daySlotsElements.push(
          <div
            ref={targetRef} // Attach the ref to the drop target div
            onDragOver={handleDragOver}
            onDrop={(e) =>
              handleDrop(e, {
                ...locationXY,
                slot: i,
              })
            }
            id={"taken"}
            className="slot-item"
            style={isCompactMode ? { margin: "5px 0px" } : {}}
          >
            <DraggableMeal
              draggedValueRef={draggedValueRef}
              meal={mealForSlot.name}
              hideName={!isFirstOccupiedSlot}
              mealOptions={mealOptions}
              percentage={percentage}
              assignments={assignments}
              styling={
                isLastOccupiedSlot && !(percentage == 0)
                  ? {
                      backgroundColor: `${assignments[mealForSlot.name].color}`,
                      width: "100%",
                      height: "57px",
                      //   border: "2px red solid",
                      // background: `linear-gradient(to right, ${colorOptions[addedMealIndex]} 0%, rgba(255, 0, 0, 0) ${percentage}%)`,
                    }
                  : {
                      backgroundColor: `${assignments[mealForSlot.name].color}`,
                      height: "57px",
                      width: "100%",

                      // backgroundColor: `${colorOptions[addedMealIndex]}`,
                    }
              }
              // SET REF VALUE:

              refInfo={{
                ...locationXY,
                slot: i,
                isFirst: isFirstOccupiedSlot,
                meal: mealForSlot,
              }}
              addedMealIndex={addedMealIndex}
              showDeleteBtn={isLastOccupiedSlot}
              setAddedMeals={setAddedMeals}
              mainElement={
                <div className="calendar-draggable-variant">
                  {mealForSlot.name}
                </div>
              }
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
            style={isCompactMode ? { margin: "5px 0px" } : {}}
          ></div>
        );
      }
    }
    return daySlotsElements;
  }

  return (
    <div className="CalendarV2">
      {/* <img src="https://api.iconify.design/akar-icons/camera.svg?color=%23ba3329" /> */}

      {
        <div
          className="calendarv2--row"
          style={isCompactMode ? { gap: "0px" } : {}}
        >
          {days.map((day, index) => {
            return (
              <div className="calendarv2--column-key" key={index}>
                {day}
              </div>
            );
          })}
          <div className="calendarv2--extra-meals"></div>
        </div>
      }
      {rows.map((row, rowIndex) => {
        const overflowForRow = getOverflowForRow(rowIndex);
        return (
          <div
            key={rowIndex}
            style={isCompactMode ? {} : {}}
            className="calendarv2--row calendarv2--row-value"
          >
            <div className="calendarv2--row-key">{row}</div>
            {days.map((day, columnIndex) => {
              return (
                <div
                  style={isCompactMode ? {} : {}}
                  className="calendarv2--item-value"
                  key={columnIndex}
                >
                  {getDaySlots({ row: rowIndex, column: columnIndex })}
                </div>
              );
            })}

            <div className="calendarv2--extra-meals">
              +{overflowForRow ? overflowForRow : 0}
            </div>
          </div>
        );
      })}
    </div>
  );
}
