import { useState } from "react";
import "../shopping-list/ShoppingList.css";
export default function ShoppingList({ addedMeals, mainIngredientsObj }) {
  const [isChecked, setIsChecked] = useState({ 0: false });

  function handleCheckboxToggle(e, index) {
    setIsChecked((prev) => {
      return { ...prev, [index]: !prev[index] };
    });
  }

  return (
    <div className="shopping-list">
      <h2>Shopping List</h2>

      <div className="main-ingredients-items-container keys-container">
        {/* <div className="count">Use #</div> */}
        <div className="checkbox"></div>
        <div className="ingredient-name">Name</div>
        <div>
          <div className="unit-container">
            <div className="quantity">#</div>
            <div>Unit</div>
          </div>
        </div>
      </div>
      {Object.keys(mainIngredientsObj).map((ingredientKey, index) => {
        return (
          <div key={index} className="main-ingredients-items-container">
            {/* <div className="count">
              {mainIngredientsObj[ingredientKey].count}x
            </div> */}
            <div className="checkbox">
              <input
                checked={isChecked[index]}
                type="checkbox"
                id={`checkbox${index}`}
                onChange={(e) => handleCheckboxToggle(e, index)}
              />
            </div>

            <label htmlFor={`checkbox${index}`} className="ingredient-name">
              {ingredientKey.charAt(0).toUpperCase() + ingredientKey.slice(1)}
            </label>
            {/* <div className="ingredient-name"></div> */}
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
