import { useState } from "react";
import dropdownIcon from "../../assets/dropdown.svg";
import "./MealsWithSharedIngredients.css";
export default function MealsWithSharedIngredients({
  mealOptions,
  mainIngredientsArr,
  addedMeals,
}) {
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

  // filter out meals that have already been added:
  const mealOptionsFiltered = getNonMatchingObjects(mealOptions, addedMeals);

  const getMealsWithUsedIngredients = () => {
    // results corresponds with position of mainIngredientsArr. For each ingredient, shows all meals that use that ingredient
    const ingredientNamesArr = mainIngredientsArr.map((ingredient) => {
      return ingredient.name;
    });
    return ingredientNamesArr.map((name) => {
      const unfilterdArray = mealOptionsFiltered.map((meal, index) => {
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

  return (
    <div>
      <h2>Recommened Meals</h2>
      {/* <div>
        (Found {reccommendedMealsArr.length} Meals that use the same
        ingredients)
      </div> */}
      {/* <br></br> */}
      <div>
        {reccommendedMealsArr.map((meal, index) => {
          return <li key={index}>{meal}</li>;
        })}
      </div>
      <div>
        <h4>Reccomendations by Ingredient</h4>
        {mealsWithUsedIngredients.map((mealsForIngredientArr, index) => {
          if (!(mealsForIngredientArr.length == 0)) {
            // only display ingredients that have a meal matched that has not been added
            return (
              <div
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
                  <div>{mainIngredientsArr[index].name}</div>
                </div>
                {isDropdown[index] && (
                  <div className="recomended-dropdown-content">
                    <div>
                      {console.log("here", mealsForIngredientArr)}
                      {mealsForIngredientArr.map((meal, index) => {
                        return <li key={index}>{meal}</li>;
                      })}
                    </div>
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
