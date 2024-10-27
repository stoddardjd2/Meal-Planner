import { useEffect, useState } from "react";
import DraggableMeal from "../draggable-meal/DraggableMeal";
import "./CalendarV2.css";
import { useRef } from "react";
import subtractIcon from "../../assets/subtract.svg";
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
    const draggedAddedMealIndex = draggedValueRef.current.addedMealIndex;
    const draggedIsFirst = draggedValueRef.current.isFirst;
    const draggedIsOnCalendar = draggedValueRef.current.isOnCalendar;
    const draggedIsLast = draggedValueRef.current.isLast;
    const draggedMeal = draggedValueRef.current.meal;
    const draggedMealLength = Math.ceil(
      draggedMeal.servings * draggedMeal?.multiplier
    );
    let rowOverflowLength = 0;
    const value = location.column + 1;
    const min = draggedLocation?.column + 1;
    const max = draggedLocation?.column + draggedMealLength;
    const inColumnRange = value >= min && value <= max;

    const hasSameSlotIndex = draggedLocation?.slot == location.slot;
    const hasSameRowIndex = draggedLocation?.row == location.row;
    const targetIsOnSelf =
      inColumnRange && hasSameSlotIndex & hasSameRowIndex ? true : false;

    const targetSlot = e.currentTarget.id;

    // let overlapDetection = [];
    // addedMeals.map((meal, index) => {
    //   for (let i = 0; i < draggedMealLength; i++) {
    //     overlapDetection.push(
    //       location.column + i == meal.location.column &&
    //         location.row == meal.location.row &&
    //         location.slot == meal.location.slot
    //     );
    //   }
    // });
    // const isTargetOverlapping = overlapDetection.includes(true);
    // const isTargetOverlappingOnOtherLocation = isTargetOverlapping;

    if (targetSlot == "empty") {
      if (location.column + draggedMealLength > 7) {
        // update overflow length for row if overflows
        rowOverflowLength = location.column + draggedMealLength - days.length;
      }
      // const isFirstOccupiedSlot = min == location.column ? true : false;
      // if dragging first slot of meal, move entire group }
      if (draggedIsOnCalendar) {
        // if dragging an element on calendar
        if (!draggedIsFirst) {
          // if not first item and dragged, remove dragged and place to dragged spot.
          //update data with new positions to compensate for break
          setAddedMeals((prev) => {
            // update original meal to be 1 less
            // const originalCostUpdated = +(
            //   (+(+draggedMeal.servings - 1) / +draggedMeal.servings) *
            //   +draggedMeal.cost
            // ).toFixed(2);
            // const newCost = +(
            //   (1 / +draggedMeal.servings) *
            //   +draggedMeal.cost
            // ).toFixed(2);
            const copy = [...prev];
            const updatedOriginalMultiplier =
              (+draggedMeal.servings * +draggedMeal.multiplier - 1) /
              +draggedMeal.servings;
            copy.splice(draggedAddedMealIndex, 1, {
              ...draggedMeal,
              // servings: draggedMeal.servings - 1,
              multiplier: updatedOriginalMultiplier,
              // cost: originalCostUpdated,
            });
            const updatedNewMultiplier = 1 / draggedMeal.servings;
            return [
              ...copy,
              {
                ...draggedMeal,
                // servings: 1,
                overflow: 0,
                location,
                multiplier: updatedNewMultiplier,
                // cost: newCost,
              },
            ];
          });
        } else if (true) {
          // !isTargetOverlappingOnOtherLocation

          // if dragging first element on calendar, remove old position  -
          // and add new position IF dropped location calculated length DOES -
          //  NOT overlap with other taken slots
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
              originalServings: draggedMeal.servings,
              originalMultiplier: draggedMeal.multiplier,
            },
          ];
        });
      }
    } else if (!(targetSlot == "first") && targetIsOnSelf) {
      // if target slot is not first and within length, move meal location to target
      setAddedMeals((prev) => {
        const copy = [...prev];
        copy.splice(draggedAddedMealIndex, 1, {
          ...prev[draggedAddedMealIndex],
          location,
          overflow: { [location.row]: rowOverflowLength },
        });
        return copy;
      });
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
      // let isOverlapping = false;
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
            id={isFirstOccupiedSlot ? "first" : "taken"}
            className="slot-item"
            style={isCompactMode ? { margin: "5px 0px" } : {}}
          >
            <DraggableMeal
              draggedValueRef={draggedValueRef}
              meal={mealForSlot}
              hideName={!isFirstOccupiedSlot}
              mealOptions={mealOptions}
              percentage={percentage}
              // addedMeals={addedMeals}
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
                location: mealForSlot.location,
                isFirst: isFirstOccupiedSlot,
                isLast: isLastOccupiedSlot,
                meal: mealForSlot,
                test: "test!",
                isOnCalendar: true,
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
            {isLastOccupiedSlot && !isFirstOccupiedSlot && (
              // to remove 1 serving if on last part of meal and not first
              <button
                onClick={() => {
                  setAddedMeals((prev) => {
                    // update original meal to be 1 less
                    const originalServings = mealForSlot.originalServings;
                    const originalMultiplier = mealForSlot.originalMultiplier;

                    const originalCostUpdated = +(
                      (+(+mealForSlot.servings - 1) / +mealForSlot.servings) *
                      +mealForSlot.cost
                    ).toFixed(2);

                    // FIX BUG, IF USING MULTIPLIER AND SUBTRACT ITEM, DOES NOT UPDATE SERVING SIZE CORRECTLY
                    // MEAL INGREDIENTS QUANTITY NOT UPDATING PROPERLY. USES MULTIPLIER TO CALCULATE.

                    // const servingRatio =
                    //   (mealForSlot.servings - 1) / originalServings;
                    // const ingredientsMultiplier = (
                    //   originalMultiplier * servingRatio
                    // ).toFixed(2);

                    // console.log("SERVING RATIO", servingRatio);

                    // console.log("NEW MULTIPLIER", ingredientsMultiplier);

                    const copy = [...prev];
                    // console.log(
                    //   "SERVINGS BLOCKS",

                    //   (mealForSlot.servings - 1) * mealForSlot.multiplier
                    //   // (mealForSlot.servings - 1) * mealForSlot.multiplier
                    // );
                    const updatedMultiplier =
                      (+mealForSlot.servings * +mealForSlot.multiplier - 1) /
                      +mealForSlot.servings;

                    copy.splice(addedMealIndex, 1, {
                      ...mealForSlot,
                      // servings: mealForSlot.servings - 1,
                      multiplier: updatedMultiplier,
                      // cost: originalCostUpdated,
                      // ingredientsMultiplier: ingredientsMultiplier,
                    });
                    return [...copy];
                  });
                }}
                className="subtract-servings"
              >
                <img src={subtractIcon} />
              </button>
            )}
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
    <div  className="CalendarV2">
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
                  key={columnIndex}
                  style={isCompactMode ? {} : {}}
                  className="calendarv2--item-value"
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
