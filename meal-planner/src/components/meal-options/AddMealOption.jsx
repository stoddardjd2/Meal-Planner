import { useState, useRef, useEffect } from "react";
import plusIcon from "../../assets/plus.svg";
import xIcon from "../../assets/x.svg";
import MealOptions from "./MealOptions";
import QuickAddAnalyzer from "./QuickAddAnalyzer";
import Dropdown from "../Dropdown";
import StandardizedNamesBtn from "./StandardizedNamesBtn";
export default function AddMealOption({
  popupRef,
  setMealOptions,
  editMeal,
  setIsDropdown,
  styling,
  mealOptions,
}) {
  // const [ingredients, setIngredients] = useState(["afaf", "2"]);
  const inputRef = useRef(null);
  const inputQuantityRef = useRef(null);
  const inputUnitsRef = useRef(null);
  const [isNameValid, setIsNameValid] = useState(true);
  const [changesTracker, setChangesTracker] = useState([]);
  const [formInput, setFormInput] = useState(
    // if editing, loadValues
    editMeal
      ? {
          name: editMeal.name,
          link: editMeal.link,
          servings: editMeal.servings,
          prepTimeMin: editMeal.prepTimeMin,
          cost: editMeal.cost,
          ingredients: [...editMeal.ingredients],
          multiplier: editMeal.multiplier,
        }
      : {
          name: "",
          link: "",
          servings: undefined,
          prepTimeMin: undefined,
          cost: "",
          ingredients: [],
          multiplier: 1,
        }
  );

  useEffect(() => {
    let index = -1; // Default to -1 if no match is found

    if (editMeal) {
      for (let i = 0; i < mealOptions.length; i++) {
        if (mealOptions[i].name === editMeal.name) {
          index = i;
          break; // Exit the loop once a match is found
        }
      }
      if (!(index == -1)) {
        setMealOptions((prev) => {
          const copy = [...prev];
          copy.splice(index, 1, formInput);
          return [...copy];
        });
      }
    }
    //  else {
    //   setMealOptions((prev) => {
    //     const copy = [...prev];
    //     copy.unshift(formInput);
    //     return [...copy];
    //   });
    // }
  }, [formInput]);

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
    if (
      !mealOptions.some((meal) => {
        return meal.name == formInput.name;
      })
    ) {
      setIsNameValid(true);

      setMealOptions((prev) => {
        const copy = [...prev];
        copy.unshift(formInput);
        return [...copy];
      });
    } else {
      setIsNameValid(false);
    }
  }

  function handleSubmitIngredient(e) {
    e.preventDefault();
    const input = inputRef.current.value;
    const inputQuantity = inputQuantityRef.current.value;
    const inputUnits = inputUnitsRef.current.value;
    if (input) {
      //reset input fields:
      inputRef.current.value = "";
      inputQuantityRef.current.value = "";
      inputUnitsRef.current.value = "";

      setFormInput((prev) => {
        const ingredientsCopy = [...prev.ingredients];
        ingredientsCopy.unshift({
          name: input,
          quantity: inputQuantity,
          units: inputUnits,
        });
        return { ...prev, ingredients: [...ingredientsCopy] };
      });
      setChangesTracker([]);
      // clear array for undoing Quick Add Feature since will change index and not function preoperly-
      // add ids to fix
    }
  }
  function handleRemoveIngredient(e, index) {
    e.preventDefault();
    setChangesTracker([]);
    setFormInput((prev) => {
      const ingredientsCopy = [...prev.ingredients];
      ingredientsCopy.splice(index, 1);
      return { ...prev, ingredients: [...ingredientsCopy] };
    });
  }
  return (
    <div
      className="add-meal-popup"
      // style={
      //   editMeal
      //     ? {}
      //     : {
      //         translate: "-230px",
      //       }
      // }
      style={styling ? { ...styling } : {}}
      ref={popupRef}
    >
      <form>
        {Object.keys(formInput).map((inputField, index) => {
          if (inputField === "ingredients") {
            return (
              <div key={index} className="ingredients-main-container">
                <h2>Ingredients</h2>
                <h4 className="quick-add ingredients-headers">Quick Add</h4>
                <QuickAddAnalyzer
                  setChangesTracker={setChangesTracker}
                  changesTracker={changesTracker}
                  setFormInput={setFormInput}
                />
                <h4 className="quick-add ingredients-headers">Manual Add</h4>
                <div className="input-option-container">
                  <div className="ingredients-key-grid">
                    <div className="ingredients-key-container">
                      <label htmlFor="Name" className="name name-key">
                        Name
                      </label>
                      <label htmlFor="Count" className="name quantity-key">
                        Count
                      </label>
                      <label htmlFor="Units" className="name units-key">
                        Units
                      </label>
                    </div>
                    <div className="ingredients-key-container">
                      <input className="" id="Name" ref={inputRef}></input>

                      <input
                        id="Count"
                        className="quantity-input"
                        ref={inputQuantityRef}
                      ></input>

                      <div className="flex-grid-item">
                        <input
                          id="Units"
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
                    </div>

                    {formInput.ingredients.map((ingredient, index) => {
                      return (
                        <div className="ingredient-container" key={index}>
                          <input
                            onChange={(e) => {
                              setFormInput((prev) => {
                                const copy = [...prev.ingredients];
                                copy.splice(index, 1, {
                                  name: e.target.value,
                                  quantity: prev.ingredients[index].quantity,
                                  units: prev.ingredients[index].units,
                                });
                                return {
                                  ...prev,
                                  ingredients: [...copy],
                                };
                              });
                            }}
                            value={formInput.ingredients[index].name}
                          ></input>
                          <input
                            value={formInput.ingredients[index].quantity}
                            className="quantity-input"
                            onChange={(e) => {
                              setFormInput((prev) => {
                                const copy = [...prev.ingredients];
                                copy.splice(index, 1, {
                                  name: prev.ingredients[index].name,
                                  quantity: e.target.value,
                                  units: prev.ingredients[index].units,
                                });
                                return {
                                  ...prev,
                                  ingredients: [...copy],
                                };
                              });
                            }}
                          ></input>

                          <div className="flex-grid-item ">
                            <input
                              value={formInput.ingredients[index].units}
                              className="units-input"
                              onChange={(e) => {
                                setFormInput((prev) => {
                                  const copy = [...prev.ingredients];
                                  copy.splice(index, 1, {
                                    name: prev.ingredients[index].name,
                                    quantity: prev.ingredients[index].quantity,
                                    units: e.target.value,
                                  });
                                  return {
                                    ...prev,
                                    ingredients: [...copy],
                                  };
                                });
                              }}
                            ></input>
                            <button
                              className="remove-ingredient noFocusBtn"
                              onClick={(e) => handleRemoveIngredient(e, index)}
                            >
                              <img className="x-icon" src={xIcon} />
                            </button>
                          </div>
                        </div>
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
          } else if (inputField == "multiplier") {
            // hide multiplier field
            return;
          } else {
            return (
              <div className="input-option-container" key={index}>
                <label htmlFor={inputField} className="name">
                  {inputField == "prepTimeMin"
                    ? "Total Time (Minutes)"
                    : inputField.charAt(0).toUpperCase() + inputField.slice(1)}
                </label>
                {/* capitilize first letter of string */}

                <div className="input-row-container">
                  <input
                    disabled={editMeal && inputField == "name" ? true : false}
                    // disable input if editing and if name input field
                    id={inputField}
                    onChange={(e) => {
                      setFormInput((prev) => {
                        // const copy = [...prev];
                        // copy.splice(index, 1, e.target.value);
                        return { ...prev, [inputField]: e.target.value };
                      });
                    }}
                    value={formInput[inputField]}
                  ></input>
                  {!isNameValid && inputField == "name" && (
                    <div>Error, name is taken</div>
                  )}
                </div>
              </div>
            );
          }
        })}
      </form>
      {editMeal ? (
        // <button onClick={handleUpdateMeal}>Update</button>
        <></>
      ) : (
        <button className="add-meal-button" onClick={handleSubmitNewMeal}>
          Add Meal
        </button>
      )}
      <button onClick={() => setIsDropdown(false)} className="exit-button">
        <img src={xIcon} />
      </button>
      <StandardizedNamesBtn formInput={formInput} setFormInput={setFormInput} />
    </div>
  );
}
