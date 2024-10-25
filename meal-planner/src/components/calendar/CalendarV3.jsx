import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";
import GridLayout from "react-grid-layout";
import { Responsive as ResponsiveGridLayout } from "react-grid-layout";
import { useRef, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import plusIcon from "../../assets/plus.svg";
import DraggableMeal from "../draggable-meal/DraggableMeal";
import MealOptionCard from "../meal-options/MealOptionCard";
import xIcon from "../../assets/x.svg";
import "./CalendarV3.css";
export default function CalendarV3({
  addedMeals,
  draggedValueRef,
  setAddedMeals,
  mealOptions,
}) {
  const ResponsiveGridLayout = WidthProvider(Responsive);
  const [isMouseOverDropArea, SetIsMouseOverDropArea] = useState(false);
  const [isMouseOverMeal, SetIsMouseOverMeal] = useState(false);
  const [isMouseOverBtn, SetIsMouseOverBtn] = useState(false);
  const targetRef = useRef(null); // Ref to directly manipulate the DOM content
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

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const rowSections = ["Morning", "Afternoon", "Evening"];

  // layout is an array of objects
  //   const layout = [
  //     { i: "a", x: 0, y: 0, w: 1, h: 2, static: false },
  //     { i: "b", x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4 },
  //     { i: "c", x: 4, y: 0, w: 1, h: 2 },
  //   ];
  console.log("addedMeals", addedMeals);

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e, location) => {
    e.preventDefault();
    // const location = e.currentTarget.id;
    const draggedName = draggedValueRef.current.name;
    console.log("draggedName", draggedName);

    let draggedMeal = {};
    mealOptions.some((meal) => {
      // find meal that matches name and exit after finding match
      if (meal.name.toLowerCase() == draggedName.toLowerCase()) {
        draggedMeal = meal;
        return true;
      }
      return false;
    });
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
    // const draggedLocation = draggedValueRef.current.location;
    // const draggedAddedMealIndex = draggedValueRef.current.addedMealIndex;
  };
  return (
    <div className="CalendarV3">
      <GridLayout
        className="layout"
        // layout={layout}
        cols={12}
        rowHeight={30}
        width={1200}
        // allowOverlap = {true}
        isDroppable={true}
        preventCollision={true}
        isDraggable={!isMouseOverBtn}
        // droppingItem={{ i: "testing", w: 4, h: 4 }}
        // onDrop={(e) => {
        //   console.log("DROPPED");
        //   handleDrop(e);
        // }}
        // onDragOver={(e) => handleDragOver(e)}
      >
        {days.map((day, index) => {
          return (
            <div
              ref={targetRef} // Attach the ref to the drop target div
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, { x: index, y: 1 })}
              key={"day-" + index}
              className="day-item"
              data-grid={{
                x: index,
                y: 0,
                w: 1,
                h: 1,
                minW: 1,
                maxW: 1,
                static: true,
              }}
            >
              {day}
            </div>
          );
        })}
        {addedMeals.map((meal, index) => {
          console.log("MAPPING MEALS", meal);
          const length = meal.servings
            ? meal.servings * meal.multiplier
            : 1 * meal.multiplier;
          //   round up so always take up a slot and visually change slot to show percentage
          let lengthRoundedUp = Math.ceil(length);
          console.log("ROUND", lengthRoundedUp);
          const innerGridElements = () => {
            const elements = [];
            for (let i = 0; i < lengthRoundedUp; i++) {
              elements.push(<div className="inner-grid-item">Grid {i}</div>);
            }
            return elements;
          };
          return (
            <div
              data-grid={{
                x: meal.location.x,
                y: meal.location.y,
                w: lengthRoundedUp,
                h: 1.5,
                maxH: 1.5,
                minH: 1.5,
                minW: lengthRoundedUp,
                maxW: lengthRoundedUp,
              }}
              key={"meal-" + meal.name + index}
              className="main-meal-item-container"
            >
              <div
                onMouseOver={() => SetIsMouseOverMeal(index)}
                onMouseLeave={() => SetIsMouseOverMeal()}
                className="meal-item"
                style={{ backgroundColor: `${colorOptions[index]}` }}
              >
                <div> {meal.name}</div>

                {console.log("MEAL!", addedMeals)}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    SetIsMouseOverBtn()
                    setAddedMeals((prev) => {
                      console.log("SETTING MEALS!");
                      const copy = [...prev];
                      copy.splice(index, 1);
                      return copy;
                    });
                  }}
                  className="delete-btn"
                  onMouseOver={() => SetIsMouseOverBtn(true)}
                  onMouseLeave={() => SetIsMouseOverBtn()}
                >
                  <img src={xIcon} />
                </button>
              </div>
            </div>
          );
        })}
      </GridLayout>
      <div className="drop-area-container">
        {days.map((day, index) => {
          console.log("x", index);
          return (
            <div
              className="add-meal-drop-area"
              ref={targetRef} // Attach the ref to the drop target div
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, { x: index, y: 10 })}
              style={{ height: "50px" }}
              key={"drop-area-" + index}
              onMouseOver={() => SetIsMouseOverDropArea(index)}
              onMouseLeave={() => SetIsMouseOverDropArea()}
              //   data-grid={{
              //     x: index,
              //     y: 7,
              //     w: 1,
              //     h: 2,
              //     maxH: 1.5,
              //     minH: 1.5,
              //     static: true,
              //     // minW: lengthRoundedUp,
              //     // maxW: lengthRoundedUp,
              //   }}
            >
              <img src={plusIcon} />
              {isMouseOverDropArea == index && (
                <div className="tooltip">
                  *Drag one of your added meals here to add
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="lines-overlay">
        {days.map((day, index) => {
          return <div className="overlay-column" key={index}></div>;
        })}
      </div>
    </div>
  );
}
