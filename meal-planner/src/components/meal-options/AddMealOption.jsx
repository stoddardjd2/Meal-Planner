import { useState, useRef } from "react";
import plusIcon from "../../assets/plus.svg";
import xIcon from "../../assets/x.svg";
export default function AddNewMealOption({
  popupRef,
  setMealOptions,
  editMeal,
  setIsDropdown,
}) {
  // const [ingredients, setIngredients] = useState(["afaf", "2"]);
  const inputRef = useRef(null);
  const inputQuantityRef = useRef(null);
  const inputUnitsRef = useRef(null);

  const [formInput, setFormInput] = useState(
    // if editing, loadValues
    editMeal
      ? {
          name: editMeal.meal.name,
          link: editMeal.meal.link,
          servings: editMeal.meal.servings,
          prepTimeMin: editMeal.meal.prepTimeMin,
          cost: editMeal.meal.cost,
          ingredients: [...editMeal.meal.ingredients],
        }
      : {
          name: "",
          link: "",
          servings: undefined,
          prepTimeMin: undefined,
          cost: "",
          ingredients: [{ name: "", quantity: undefined, units: undefined }],
        }
  );

  function handleUpdateMeal(e) {
    e.preventDefault();
    setIsDropdown(false);
    setMealOptions((prev) => {
      const copy = [...prev];
      copy.splice(editMeal.index, 1, formInput);
      return [...copy];
    });
  }

  function handleSubmitNewMeal(e) {
    e.preventDefault();
    setMealOptions((prev) => {
      const copy = [...prev];
      copy.unshift(formInput);
      return [...copy];
    });
  }

  function handleSubmitIngredient(e) {
    e.preventDefault();
    const input = inputRef.current.value;
    const inputQuantity = inputQuantityRef.current.value;
    const inputUnits = inputUnitsRef.current.value;
    console.log("units", inputUnits);
    if (input) {
      //reset input fields:
      inputRef.current.value = "";
      inputQuantityRef.current.value = "";
      inputUnitsRef.current.value = "";

      setFormInput((prev) => {
        const ingredientsCopy = [...prev.ingredients];
        console.log("ingredientsCopy", ingredientsCopy);
        ingredientsCopy.unshift({
          name: input,
          quantity: inputQuantity,
          units: inputUnits,
        });
        return { ...prev, ingredients: [...ingredientsCopy] };
      });
    }
  }
  function handleRemoveIngredient(e, index) {
    e.preventDefault();
    setFormInput((prev) => {
      const ingredientsCopy = [...prev.ingredients];
      ingredientsCopy.splice(index, 1);
      return { ...prev, ingredients: [...ingredientsCopy] };
    });
  }
  return (
    <div className="add-meal-popup" ref={popupRef}>
      <form>
        {Object.keys(formInput).map((inputField, index) => {
          if (inputField === "ingredients") {
            return (
              <div key={index} className="ingredients-main-container">
                <h4>Ingredients</h4>
                <div className="input-option-container">
                  <div className="ingredients-key-grid">
                    <div className="name ">Ingredient</div>
                    <div className="name">Count</div>
                    <div className="name">Units</div>

                    <input ref={inputRef}></input>
                    <input
                      className="quantity-input"
                      ref={inputQuantityRef}
                    ></input>

                    <div className="flex-grid-item">
                      <input
                        className="units-input"
                        ref={inputUnitsRef}
                      ></input>
                      <button
                        className="add-ingredient-btn noFocusBtn"
                        onClick={handleSubmitIngredient}
                      >
                        <img className="plus-icon" src={plusIcon} />
                      </button>
                    </div>

                    {formInput.ingredients.map((ingredient, index) => {
                      return (
                        <>
                          <li className="ingredient-name grid-value-item">
                            {ingredient.name}
                          </li>
                          <div className="grid-value-item">{ingredient.quantity}</div>
                          <div className="flex-grid-item grid-value-item">
                            <div>{ingredient.units}</div>
                            <button
                            className="remove-ingredient noFocusBtn"
                              onClick={(e) => handleRemoveIngredient(e, index)}
                            >
                              <img className="x-icon" src={xIcon} />
                            </button>
                          </div>
                        </>
                      );
                    })}
                  </div>

                  {/* capitilize first letter of string */}
                </div>
                {/* <ul className="ingredients-container">
                  {formInput.ingredients.map((ingredient, index) => {
                    return (
                      <li key={index}>
                        <div className="ingredient-item-container">
                          <div>{ingredient.name}</div>
                          <button
                            onClick={(e) => handleRemoveIngredient(e, index)}
                          >
                            <img className="x-icon" src={xIcon} />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul> */}
              </div>
            );
          } else {
            return (
              <div className="input-option-container" key={index}>
                {console.log("prep time", inputField)}
                <div className="name">
                  {(inputField == "prepTimeMin")
                    ? "Total Time (Minutes)"
                    : inputField.charAt(0).toUpperCase() + inputField.slice(1)}
                </div>
                {/* capitilize first letter of string */}
                <input
                  onChange={(e) => {
                    setFormInput((prev) => {
                      // const copy = [...prev];
                      // copy.splice(index, 1, e.target.value);
                      return { ...prev, [inputField]: e.target.value };
                    });
                  }}
                  value={formInput[inputField]}
                ></input>
              </div>
            );
          }
        })}
        {editMeal ? (
          <button onClick={handleUpdateMeal}>Update</button>
        ) : (
          <button onClick={handleSubmitNewMeal}>Add</button>
        )}
      </form>
    </div>
  );
}
