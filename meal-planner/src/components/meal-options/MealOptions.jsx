import "./MealOptions.css";
import AddNewMealOption from "./AddMealOption";
import { useEffect, useState, useRef } from "react";
import xIcon from "../../assets/x.svg";
import clockIcon from "../../assets/clock.svg";
import Dropdown from "../Dropdown";
export default function MealOptions({
  draggedValueRef,
  mealOptions,
  setMealOptions,
}) {
  const [isAdding, setIsAdding] = useState(false);
  const popupRef = useRef(null); // Reference to the popup element
  const buttonRef = useRef(null);

  function handleToggleIsAdding(e) {
    // e.stopPropagation()
    if (e.target.id === "isAddingButton") {
      setIsAdding((prev) => !prev);
    }
  }

  // Handle clicks outside the popup
  const handleClickOutside = (event) => {
    console.log("here1", popupRef.current, event.current);

    if (
      popupRef.current &&
      !popupRef.current.contains(event.target) &&
      !buttonRef.current.contains(event.target)
    ) {
      console.log("close1");
      setIsAdding(false); // Close the popup if clicked outside
    }
  };

  // Add event listener to detect clicks outside of the popup
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <h2>Options</h2>
      <div className="actions-container">
        <button
          ref={buttonRef}
          id={"isAddingButton"}
          onClick={handleToggleIsAdding}
        >
          Add
        </button>
        {isAdding && (
          <AddNewMealOption
            popupRef={popupRef}
            setMealOptions={setMealOptions}
          />
        )}
      </div>
      <div className="meal-options-list">
        {mealOptions.map((meal, index) => {
          return (
            <MealOption
              meal={meal}
              key={index}
              index={index}
              setMealOptions={setMealOptions}
              draggedValueRef={draggedValueRef}
            />
          );
        })}
      </div>
    </div>
  );
}

function MealOption({ meal, index, setMealOptions, draggedValueRef }) {
  const [isDropdown, setIsDropdown] = useState(false);
  const [servingSizeMultiplier, setServingSizeMultiplier] = useState(1);
  const popupRef2 = useRef(null); // Reference to the popup element
  const buttonRef2 = useRef(null);
  // const ingredientsRef = useRef(null);
  // const ingredientsBtnRef = useRef(null);
  const multiplierOptions = [0.5, 1, 2];
  const handleDragStart = (e, value) => {
    draggedValueRef.current = { value: value, id: index }; // Set the value of the dragged element when dragging starts
  };
  const handleDragEnd = (e) => {
    e.target.style.cursor = "grab"; // Reset the cursor after dragging ends
  };

  function handleDropdownToggle() {
    setIsDropdown((prev) => !prev);
  }

  // Handle clicks outside the popup
  const handleClickOutside2 = (event) => {
    console.log("here", popupRef2.current, event.current);
    if (
      popupRef2.current &&
      !popupRef2.current.contains(event.target) &&
      !buttonRef2.current.contains(event.target)
    ) {
      setIsDropdown(false); // Close the popup if clicked outside
    }
    // if (
    //   ingredientsRef.current &&
    //   !ingredientsRef.current.contains(event.CurrentTarget) &&
    //   !ingredientsBtnRef.current.contains(event.CurrentTarget)
    // ) {
    //   setIsIngredientsDropdown(false); // Close the popup if clicked outside
    // }
  };

  // Add event listener to detect clicks outside of the popup
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside2);

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside2);
    };
  }, []);

  return (
    <div className="dropdown-container">
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, meal.name)}
        onDragEnd={handleDragEnd}
        style={{ cursor: "grab" }}
        className="meal-option"
      >
        <button
          onClick={handleDropdownToggle}
          className="dropdown-button"
          ref={buttonRef2}
        ></button>
        <div>{meal.name}</div>

        {meal.cost && (
          <>
            <div>-</div>
            <div>
              ${+meal.cost / meal.servings}
              /serving
            </div>
          </>
        )}
        {meal?.prepTimeMin && (
          <>
            <div>-</div>
            <div className="flex-box">
              <img src={clockIcon} />

              <div>{meal.prepTimeMin} min</div>
            </div>
          </>
        )}
        {meal?.servings ? (
          <>
            <div>-</div>
            <div>Servings ( {+meal.servings * servingSizeMultiplier} )</div>
            <div className="serving-size-multiplier-container">
              {multiplierOptions.map((option, multiplierIndex) => {
                return (
                  <button
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
                        ? { outline: "2px white solid" }
                        : {}
                    }
                  >
                    {`${option == 0.5 ? ".5" : option}x`}
                  </button>
                );
              })}
              {meal.ingredients && (
                <>
                  <div>-</div>
                  <div>
                    <Dropdown
                      buttonText={`View Ingredients (${meal.ingredients.length})`}
                      listElements={meal.ingredients.map(
                        (ingredient, index) => {
                          return (
                            <div className="ingredient-list-item" key={index}>
                              <div className="name">{ingredient.name}</div>
                              <div className="quantity">{ingredient.quantity}</div>
                              <div className="units">{ingredient.units}</div>
                            </div>
                          );
                        }
                      )}
                    />
                  </div>
                </>
              )}
              {meal.cost && (
                <>
                  <div>-</div>
                  <div className="meal-cost">
                    ${meal.cost * meal.multiplier}
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <></>
        )}
        <button className="exit-button">
          <img className="x-icon" src={xIcon} />
        </button>
      </div>
      {isDropdown && (
        // <div className="dropdown">
        <AddNewMealOption
          popupRef={popupRef2}
          setMealOptions={setMealOptions}
          editMeal={{ index: index, meal: meal }}
          setIsDropdown={setIsDropdown}
        />
        // </div>
      )}
    </div>
  );
}
