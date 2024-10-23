import { useState, useRef, useEffect } from "react";
import plusIcon from "../../assets/plus.svg";
import xIcon from "../../assets/x.svg";
import MealOptions from "./MealOptions";
export default function AddNewMealOption({
  popupRef,
  setMealOptions,
  editMeal,
  setIsDropdown,
  styling,
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
          multiplier: editMeal.meal.multiplier,
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
    console.log("form", formInput);
  }, [formInput]);

  useEffect(() => {
    if (editMeal) {
      setMealOptions((prev) => {
        const copy = [...prev];
        copy.splice(editMeal.index, 1, formInput);
        return [...copy];
      });
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
                <h4>Ingredients</h4>
                <div className="input-option-container">
                  <div className="ingredients-key-grid">
                    <div className="name">Name</div>
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
          } else if (inputField == "multiplier") {
            // hide multiplier field
            return;
          } else {
            return (
              <div className="input-option-container" key={index}>
                <div className="name">
                  {inputField == "prepTimeMin"
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
          // <button onClick={handleUpdateMeal}>Update</button>
          <></>
        ) : (
          <button onClick={handleSubmitNewMeal}>Add Meal</button>
        )}
      </form>
      <button onClick={()=>setIsDropdown(false)} className="exit-button">
        <img src={xIcon} />
      </button>
    </div>
  );
}
