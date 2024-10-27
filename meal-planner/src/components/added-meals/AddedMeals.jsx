import "../added-meals/AddedMeals.css";
import dropdownIcon from "../../assets/dropdown.svg";
import { useState } from "react";

export default function AddedMeals({
  addedMeals,
  mainIngredientsArr,
  mealOptions,
}) {
  const [isHeaderDropdown, setIsHeaderDropdown] = useState(false);
  const [isMainIngredientsDropdown, setIsMainIngredientsDropdown] =
    useState(true);
  const [isDropdown, setIsDropdown] = useState({});
  const totalCost = () => {
    const mealCosts = addedMeals.map((addedMeal) => {
      if (addedMeal.cost) {
        return parseFloat((addedMeal.cost * addedMeal.multiplier).toFixed(2));
      } else {
        return 0;
      }
    });
    const sum = mealCosts.reduce(
      (accumulator, currentValue) => +accumulator + +currentValue,
      0
    );
    const costPerServingFormatted = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(sum);

    return costPerServingFormatted;
  };
  // const getMealsWithUsedIngredients = () => {
  //   // results corresponds with position of mainIngredientsArr. For each ingredient, shows all meals that use that ingredient
  //   const ingredientNamesArr = mainIngredientsArr.map((ingredient) => {
  //     return ingredient.name;
  //   });
  //   const matches = ingredientNamesArr.map((name) => {
  //     const unfilterdArray = mealOptions.map((meal, index) => {
  //       const mealIngredientsArr = meal.ingredients.map((ingredient) => {
  //         return ingredient.name;
  //       });
  //       if (mealIngredientsArr.includes(name)) {
  //         return { name: meal.name, index: index };
  //       }
  //     });
  //     const filteredArray = unfilterdArray.filter(
  //       (element) => element !== undefined
  //     );
  //     return filteredArray;
  //   });
  // };
  // const mealsWithUsedIngredients = getMealsWithUsedIngredients();

  return (
    <div className="added-meals-container">
      <h2>
        <button
          onClick={() => setIsHeaderDropdown((prev) => !prev)}
          className="dropdown-button"
        >
          <img src={dropdownIcon} />
        </button>
        This Week
      </h2>

      {/* <div className="analysis-container"> */}
      {!isHeaderDropdown && (
        <>
          <div>Total Cost: ${totalCost()}</div>
          <h5 className="main-ingredients-header ">
            Main Ingredients
            <button
              onClick={() => setIsMainIngredientsDropdown((prev) => !prev)}
              className="dropdown-button-recommended dropdown-button"
            >
              <img src={dropdownIcon} />
            </button>
          </h5>

          {isMainIngredientsDropdown && (
            <>
              <div className="main-ingredients-items-container keys-container">
                <div className="dropdown-column"></div>
                <div className="count">Use #</div>

                <div className="ingredient-name">Name</div>
                <div>
                  <div className="unit-container">
                    <div className="quantity">#</div>
                    <div>Unit</div>
                  </div>
                </div>
              </div>
              {/* </div> */}
              <div className="main-ingredients-main-container">
                {mainIngredientsArr.map((ingredient, index) => {
                  return (
                    <div className="ingredient-container-child" key={index}>
                      <div className="main-ingredients-items-container">
                        <div className="dropdown-column">
                          {/* {ingredient.count > 1 && (
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
                          )} */}
                        </div>

                        <div className="count">{ingredient.count}x</div>

                        <div className="ingredient-name">
                          {ingredient.name.charAt(0).toUpperCase() +
                            ingredient.name.slice(1)}
                        </div>
                        <div>
                          {Object.keys(ingredient.quantities).map(
                            (unitKey, index) => {
                              return (
                                <div className="unit-container" key={index}>
                                  <div className="quantity">

                                    { Number(ingredient.quantities[unitKey].toFixed(2))}
                                  </div>
                                  <div>
                                    {unitKey == "undefined" ? "" : unitKey}
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                      {isDropdown[index] && (
                        <div className="meal-for-ingredient-dropdown">
                          {addedMeals.map((meal, index) => {
                            const ingredientsForMealArray =
                              meal.ingredients.map((addedMealsIngredient) => {
                                return addedMealsIngredient.name;
                              });

                            if (
                              ingredientsForMealArray.includes(ingredient.name)
                            ) {
                              return <div key={index}>{meal.name}</div>;
                            }
                            // if(meal.name)
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
