import foodIcon from "../../assets/food.svg";
import { useState, useRef, useEffect } from "react";
import clockIcon from "../../assets/clock2.svg";
import editIcon from "../../assets/edit.svg";
import openIcon from "../../assets/open.svg";
import Dropdown from "../Dropdown";
import mealIcon from "../../assets/meal.svg";
import AddMealOption from "./AddMealOption";
import dropdownIcon from "../../assets/dropdown.svg";
import bannerIcon from "../../assets/banner.svg";
import recipeIcon from "../../assets/recipe.svg";
import "./MealOptionCard.css";
// import GetImage from "../GetImage";
export default function MealOptionCard({
  meal,
  setMealOptions,
  index,
  draggedValueRef,
  previewEnabled,
  setIsDropdown,
  isDropdown,
  styling,
}) {
  // setIsDropdown(meal)
  // console.log("HETE", setIsDropdown())
  const [isHoveringOverName, setIsHoveringOverName] = useState(false);
  // const [isDropdown, setIsDropdown] = useState(false);
  const buttonRef2 = useRef(null);
  const [servingSizeMultiplier, setServingSizeMultiplier] = useState(
    meal.multiplier
  );
  const [isHoveringOverCard, setIsHoveringOverCard] = useState(false);
  const multiplierOptions = [0.5, 1, 2];

  const handleDragEnd = (e) => {
    e.target.style.cursor = "grab"; // Reset the cursor after dragging ends
  };

  const handleDragStart = (e, name) => {
    draggedValueRef.current = { name, meal }; // Set the value of the dragged element when dragging starts
  };

  const costPerServingFormatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(meal.cost / meal.servings);

  return (
    <div
      onMouseOver={() => setIsHoveringOverCard(true)}
      onMouseLeave={() => setIsHoveringOverCard(false)}
      className="main-card-container"
    >
      <div className="meal-option-card-container">
        <div
          draggable={isDropdown ? false : true}
          //   disable draggable feature if editing meal
          onDragStart={(e) => handleDragStart(e, meal.name)}
          onDragEnd={handleDragEnd}
          className="meal-option-card"
          style={styling ? styling : {}}
        >
          <div className="food-container">
            <img className="food-img" src={foodIcon} />
          </div>
          <div className="bottom-card-container">
            <div className="left-side">
              <div className="top-container">
                <div className="card-name">
                  {meal.name.charAt(0).toUpperCase() + meal.name.slice(1)}
                </div>
              </div>
            </div>

            {isHoveringOverName && meal.cost && meal.servings && (
              <div className="cost-per-serving">
                ${costPerServingFormatted}/serving
              </div>
            )}
          </div>

          {meal.cost && (
            <div
              onMouseOver={() => setIsHoveringOverName(true)}
              onMouseLeave={() => setIsHoveringOverName(false)}
              className="meal-cost card-info-overlay"
            >
              ${parseFloat((meal.cost * meal.multiplier).toFixed(2))}
            </div>
          )}

          {meal.prepTimeMin && (
            <div className="time-container card-info-overlay">
              <img className="clock-img" src={clockIcon} />
              {meal.prepTimeMin} Min
            </div>
          )}

          {meal.servings && (
            <div className="servings-popup card-info-overlay">
              <img src={mealIcon} />
              {parseFloat((meal.servings * meal.multiplier).toFixed(1))}
            </div>
          )}

          {!previewEnabled && (
            <div
              className="card-hover-fade"
              style={!isHoveringOverCard ? { opacity: "0" } : {}}
            >
              {meal.instructions && (
                <button className="meal-btn">
                  <img src={recipeIcon} />
                </button>
              )}

              <div className="actions-container-overlay">
                <button
                  className="action-button"
                  ref={buttonRef2}
                  onClick={() => setIsDropdown(meal)}
                >
                  <img src={editIcon} />
                </button>

                {meal.link && (
                  <a href={meal.link} target="_blank">
                    <button className="action-button">
                      <img src={openIcon} />
                    </button>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* servings */}

          {!previewEnabled && (
            <div
              className="card-hover-fade"
              style={!isHoveringOverCard ? { opacity: "0" } : {}}
            >
              <div className="multiplier-fixed">
                <div className="serving-size-multiplier-containerV2">
                  {multiplierOptions.map((option, multiplierIndex) => {
                    return (
                      <button
                        className={`multiplier-${
                          multiplierIndex + 1
                        } multiplier-btn`}
                        key={multiplierIndex}
                        onClick={(e) => {
                          setMealOptions((prev) => {
                            const copy = [...prev];
                            copy.splice(index, 1, {
                              ...prev[index],
                              multiplier: option,
                            });
                            return copy;
                          });
                          setServingSizeMultiplier(option);
                        }}
                        style={
                          servingSizeMultiplier === option
                            ? {
                                translate: `0px -${10 * multiplierIndex}px`,
                                opacity: 1,
                                zIndex: 3,
                                // boxShadow:"0px 0px 10px 0px rgb(0, 0, 0)"
                              }
                            : {
                                // opacity: "60%",
                                translate: `0px -${10 * multiplierIndex}px`,
                                // zIndex: 10,
                              }
                        }
                      >
                        {`${option == 0.5 ? ".5" : option}x`}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
        {/* <input className="is-added-popup" type="checkbox"></input> */}
      </div>
    </div>
  );
}
