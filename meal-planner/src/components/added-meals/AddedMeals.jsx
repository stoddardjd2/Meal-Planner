import "../added-meals/AddedMeals.css";
export default function AddedMeals({ addedMeals, mainIngredientsObj }) {
  const totalCost = () => {
    const mealCosts = addedMeals.map((addedMeal) => {
      if (addedMeal.cost) {
        return addedMeal.cost;
      } else {
        return 0;
      }
    });
    const sum = mealCosts.reduce(
      (accumulator, currentValue) => +accumulator + +currentValue,
      0
    );
    return sum;
  };

  return (
    <div className="added-meals-container">
      <h2>This Week</h2>

      {/* <div className="analysis-container"> */}
      <div>Total: ${totalCost()}</div>
      <h5 className="main-ingredients-header ">Main Ingredients</h5>
      <div className="main-ingredients-items-container keys-container">
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
      {Object.keys(mainIngredientsObj).map((ingredientKey) => {
        return (
          <div className="main-ingredients-items-container">
            <div className="count">
              {mainIngredientsObj[ingredientKey].count}x
            </div>

            <div className="ingredient-name">
              {ingredientKey.charAt(0).toUpperCase() + ingredientKey.slice(1)}
            </div>
            <div>
              {Object.keys(mainIngredientsObj[ingredientKey].quantities).map(
                (unitKey, index) => {
                  return (
                    <div className="unit-container" key={index}>
                      <div className="quantity">
                        {mainIngredientsObj[ingredientKey].quantities[unitKey]}
                      </div>
                      <div>{unitKey == "undefined" ? "" : unitKey}</div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
