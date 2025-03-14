import { useState } from "react";
import dropdownIcon from "../../assets/dropdown.svg";
import "../shopping-list/ShoppingList.css";
export default function ShoppingList({ addedMeals, mainIngredientsArr }) {
  const [isChecked, setIsChecked] = useState({ 0: false });
  const [isHeaderDropdown, setIsHeaderDropdown] = useState(false);

  function handleCheckboxToggle(e, index) {
    setIsChecked((prev) => {
      return { ...prev, [index]: !prev[index] };
    });
  }

  return (
    <div className="shopping-list">
      <h2>
        Shopping List
        <button
          onClick={() => setIsHeaderDropdown((prev) => !prev)}
          className="dropdown-button dropdown-button-shopping-list"
        >
          <img src={dropdownIcon} />
        </button>
      </h2>

      {!isHeaderDropdown && (
        <>
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
          <div className="main-ingredients-main-container">
            {mainIngredientsArr.map((ingredient, index) => {
              return (
                <div
                  key={index}
                  className="main-ingredients-items-container ingredient-container-child"
                >
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

                  <label
                    htmlFor={`checkbox${index}`}
                    className="ingredient-name"
                  >
                    {ingredient.name.charAt(0).toUpperCase() +
                      ingredient.name.slice(1)}
                  </label>
                  {/* <div className="ingredient-name"></div> */}
                  <div>
                    {Object.keys(ingredient.quantities).map(
                      (unitKey, index) => {
                        return (
                          <div className="unit-container" key={index}>
                            <div className="quantity">
                              { Number(ingredient.quantities[unitKey].toFixed(2))}
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
        </>
      )}
    </div>
  );
}
