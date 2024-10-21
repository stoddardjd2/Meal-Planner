import { useState, useRef } from "react";

export default function AddNewMealOption({ setMealOptions, editMeal, setIsDropdown }) {
  // const [ingredients, setIngredients] = useState(["afaf", "2"]);
  const inputRef = useRef(null);

  const [formInput, setFormInput] = useState(
    // if editing, loadValues
    editMeal
      ? {
          name: editMeal.meal.name,
          link:  editMeal.meal.link,
          servings:  editMeal.meal.servings,
          prepTimeMin:  editMeal.meal.prepTimeMin,
          cost:  editMeal.meal.cost,
          ingredients: [... editMeal.meal.ingredients],
        }
      : {
          name: "",
          link: "",
          servings: undefined,
          prepTimeMin: undefined,
          cost: "",
          ingredients: [],
        }
  );

  function handleUpdateMeal(e) {
    e.preventDefault();
    setIsDropdown(false)
    setMealOptions((prev) => {
      const copy = [...prev];
      copy.splice(editMeal.index, 1, formInput)
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
    if (input) {
      inputRef.current.value = "";
      setFormInput((prev) => {
        const ingredientsCopy = [...prev.ingredients];
        ingredientsCopy.unshift(input);
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
    <div className="add-meal-popup">
      <form>
        {Object.keys(formInput).map((inputField, index) => {
          if (inputField === "ingredients") {
            return (
              <div key={index} className="ingredients-main-container">
                <div className="input-option-container">
                  <div className="name">
                    {inputField.charAt(0).toUpperCase() + inputField.slice(1)}
                  </div>
                  {/* capitilize first letter of string */}
                  <div className="ingredients-action-container">
                    <input ref={inputRef}></input>
                    <button onClick={handleSubmitIngredient}>
                      <svg
                        className="plus-icon"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M7 15C7 15.2652 7.10536 15.5196 7.29289 15.7071C7.48043 15.8946 7.73478 16 8 16C8.26522 16 8.51957 15.8946 8.70711 15.7071C8.89464 15.5196 9 15.2652 9 15V9H15C15.2652 9 15.5196 8.89464 15.7071 8.70711C15.8946 8.51957 16 8.26522 16 8C16 7.73478 15.8946 7.48043 15.7071 7.29289C15.5196 7.10536 15.2652 7 15 7H9V1C9 0.734784 8.89464 0.48043 8.70711 0.292893C8.51957 0.105357 8.26522 0 8 0C7.73478 0 7.48043 0.105357 7.29289 0.292893C7.10536 0.48043 7 0.734784 7 1V7H1C0.734784 7 0.48043 7.10536 0.292893 7.29289C0.105357 7.48043 0 7.73478 0 8C0 8.26522 0.105357 8.51957 0.292893 8.70711C0.48043 8.89464 0.734784 9 1 9H7V15Z"
                          fill="white"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <ul className="ingredients-container">
                  {formInput.ingredients.map((ingredient, index) => {
                    return (
                      <li key={index}>
                        <div className="ingredient-item-container">
                          <div>{ingredient}</div>
                          <button
                            onClick={(e) => handleRemoveIngredient(e, index)}
                          >
                            <svg
                              className="x-icon"
                              width="12"
                              height="12"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M15 1L1 15M1.00003 1L15 15"
                                stroke="white"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          } else {
            return (
              <div className="input-option-container" key={index}>
                <div className="name">
                  {inputField.charAt(0).toUpperCase() + inputField.slice(1)}
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
