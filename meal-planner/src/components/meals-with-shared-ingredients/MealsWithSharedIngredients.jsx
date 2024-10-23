import { useState } from "react";
import dropdownIcon from "../../assets/dropdown.svg";
import "./MealsWithSharedIngredients.css";
export default function MealsWithSharedIngredients({
  mealOptions,
  mainIngredientsArr,
  addedMeals,
  draggedValueRef,
}) {
  const [isHidingAddedMeals, setIsHidingAddedMeals] = useState(true);
  const [isDropdown, setIsDropdown] = useState({});
  // Function to get non-matching objects based on the `name` property
  const getNonMatchingObjects = (arr1, arr2) => {
    return [
      ...arr1.filter(
        (item1) => !arr2.some((item2) => item1.name === item2.name)
      ),
      ...arr2.filter(
        (item2) => !arr1.some((item1) => item1.name === item2.name)
      ),
    ];
  };

  // filter out meals that have already been added if enabled:
  const getMealOptionsFiltered = () => {
    if (isHidingAddedMeals) {
      return getNonMatchingObjects(mealOptions, addedMeals);
    } else return mealOptions;
  };

  const getMealsWithUsedIngredients = () => {
    // results corresponds with position of mainIngredientsArr. For each ingredient, shows all meals that use that ingredient
    const ingredientNamesArr = mainIngredientsArr.map((ingredient) => {
      return ingredient.name;
    });
    return ingredientNamesArr.map((name) => {
      const unfilterdArray = getMealOptionsFiltered().map((meal, index) => {
        const mealIngredientsArr = meal.ingredients.map((ingredient) => {
          return ingredient.name;
        });
        if (mealIngredientsArr.includes(name)) {
          // return { name: meal.name, index: index };
          return meal.name;
        }
      });
      const filteredArray = unfilterdArray.filter(
        (element) => element !== undefined
      );
      return filteredArray;
    });
  };
  const mealsWithUsedIngredients = getMealsWithUsedIngredients();
  const reccommendedMealsArr = [...new Set(mealsWithUsedIngredients.flat())];
  // flatten data and remove duplicates

  const handleDragStart = (e, name) => {
    console.log("drag start", name);
    draggedValueRef.current = { name }; // Set the value of the dragged element when dragging starts
  };
  const handleDragEnd = (e) => {
    e.target.style.cursor = "grab"; // Reset the cursor after dragging ends
  };

  return (
    <div>
      <h2>Recommened Meals</h2>
      <div className="hide-added-meals-container">
        <label htmlFor="hide-added">Show added meals</label>
        <input
          id="hide-added"
          type="checkbox"
          checked={!isHidingAddedMeals}
          onChange={() => setIsHidingAddedMeals((prev) => !prev)}
        ></input>
      </div>
      {/* <div>
        (Found {reccommendedMealsArr.length} Meals that use the same
        ingredients)
      </div> */}
      {/* <br></br> */}
      <div className="recommended-meals-container">
        {/* <div className="recommended-grid-container"> */}

        {reccommendedMealsArr.map((meal, index) => {
          return (
            <div
              draggable
              onDragStart={(e) => handleDragStart(e, meal)}
              onDragEnd={handleDragEnd}
              className="list-item-container recommended-grid-item"
              key={index}
            >
              <div className="list-item">{meal}</div>
            </div>
          );
        })}
        {/* </div> */}
      </div>
      <div className="recomendation-by-ingredient-container">
        <h4>Recomendations by Ingredient</h4>
        {mealsWithUsedIngredients.map((mealsForIngredientArr, index) => {
          if (!(mealsForIngredientArr.length == 0)) {
            // only display ingredients that have a meal matched that has not been added
            return (
              <div
                className="dropdown-recommendation-container"
                style={
                  (index + 1) % 2 === 0
                    ? { backgroundColor: "rgb(65, 65, 65)" }
                    : {}
                }
                key={index}
              >
                <div className="reccomendations-by-ingredient-item-container">
                  <button
                    onClick={(e) =>
                      setIsDropdown((prev) => {
                        return { ...prev, [index]: !prev[index] };
                      })
                    }
                    className="dropdown-button"
                  >
                    <img src={dropdownIcon} />
                  </button>
                  <div>
                    {mainIngredientsArr[index].name.charAt(0).toUpperCase() +
                      mainIngredientsArr[index].name.slice(1)}
                  </div>
                </div>
                {isDropdown[index] && (
                  <div className="recomended-dropdown-content">
                    {mealsForIngredientArr.map((meal, index) => {
                      return (
                        <div
                          draggable
                          onDragStart={(e) => handleDragStart(e, meal)}
                          onDragEnd={handleDragEnd}
                          className="list-item-container"
                          key={index}
                        >
                          <div className="list-item">{meal}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }
        })}
        <div></div>
      </div>
    </div>
  );
}