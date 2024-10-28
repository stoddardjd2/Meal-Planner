import { useState, useEffect, useRef } from "react";
import AddMealOption from "./meal-options/AddMealOption";
import plusIcon from "../assets/plus.svg";
import xIcon from "../assets/x.svg";
import removeUnitsAndNumbers from "../helpers/removeUnitsAndNumbers.js";
import loadingIcon from "../assets/loading.svg";
export default function AddMealBtn({ mealOptions, setMealOptions }) {
  const popupRef2 = useRef(null); // Reference to the popup element
  const buttonRef2 = useRef(null);
  const [isDropdown, setIsDropdown] = useState(false);
  const [addMethod, setAddMethod] = useState();
  const [urlValue, setUrlValue] = useState();
  const [isError, setIsError] = useState(false);
  const [isRecipeLoading, setIsRecipeLoading] = useState(false);
  // Handle clicks outside the popup
  // Add event listener to detect clicks outside of the popup
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    // if (
    //   popupRef.current &&
    //   !popupRef.current.contains(event.target) &&
    //   !buttonRef.current.contains(event.target)
    // ) {
    //   setIsAdding(false); // Close the popup if clicked outside
    // } else
    if (
      popupRef2.current &&
      !popupRef2.current.contains(event.target) &&
      !buttonRef2.current.contains(event.target)
    ) {
      // setIsDropdown(false); // Close the popup if clicked outside
      setIsDropdown(false);
      setAddMethod();
    }
  };

  function handleSearchByUrl(url) {
    console.log("SERACH!");
    setIsRecipeLoading(true);
    if (url) {
      fetch(
        `https://api.spoonacular.com/recipes/extract?apiKey=${"2f0681fc22e5432fb1120dde6513b6d8"}&url=${encodeURIComponent(
          url
        )}`
      )
        .then((data) => data.json())
        .then((recipeData) => {
          console.log("RES", recipeData);
          const nameTaken = mealOptions.some((meal) => {
            if (meal.name == recipeData.title) {
              return true;
            }
            return false;
          });
          if (!nameTaken) {
            const cleanName = removeUnitsAndNumbers(recipeData.title);
            // call helper function to clean up name
            console.log(cleanName);
            const formattedIngredients = recipeData.extendedIngredients.map(
              (ingredient) => {
                return {
                  name: ingredient.name,
                  quantity: ingredient.amount,
                  units: ingredient.unit,
                };
              }
            );
            function splitIntoSentences(text) {
              // Remove line breaks and extra spaces
              const cleanedText = text.replace(/\s+/g, ' ').trim();
            
              // Match sentence-ending punctuation not part of common abbreviations
              const sentences = cleanedText.match(/[^.!?]*\b(?<!\b(?:e\.g|i\.e|oz|lb|lbs|tbsp|tsp|g|ml|l|kg|cm|mm|qt|gal|pt|fl\.oz|hr|min|sec)\.)(?<!\.\.\.)[.!?](?:\s|$)/gi) || [];
              
              return sentences.map(sentence => sentence.trim());
            }
            const splitInstuctions = splitIntoSentences(
              recipeData.instructions
            );

            setIsError();
            setIsDropdown(false);
            setIsRecipeLoading(false);
            console.log("recipeData", recipeData);
            const prepTimeMin =
              recipeData.readyInMinutes == null ||
              recipeData.readyInMinutes == -1 ||
              recipeData.readyInMinutes == false
                ? undefined
                : recipeData.readyInMinutes;
            setMealOptions((prev) => {
              const newMeal = {
                name: cleanName,
                link: recipeData.sourceUrl,
                servings: recipeData.servings,
                prepTimeMin: prepTimeMin,
                cost: undefined,
                ingredients: [...formattedIngredients],
                multiplier: 1,
                instructions: splitInstuctions,
              };
              return [...prev, newMeal];
            });
          } else {
            setIsError("Meal with name is already added!");
            setIsRecipeLoading(false);
            console.log("NAME TAKEN");
          }
        })
        .catch((err) => {
          setIsRecipeLoading(false);
          setIsError("Failed to get recipe!");
          console.error("Failed to fetch recipe:", err);
        });
    }
  }

  return (
    <div className="AddMealBtn">
      <button
        style={
          !(mealOptions.length == 0)
            ? {}
            : {
                // backgroundColor:"#15b1bc",
                outline: "5px #15b1bc solid",
              }
        }
        // className="gradual-color-change"
        ref={buttonRef2}
        onClick={() => setIsDropdown(true)}
        className={`add-meal-btn ${
          mealOptions.length == 0 && "gradual-outline-change"
        }`}

        // "add-meal-btn gradual-color-change"
      >
        <img src={plusIcon} />
      </button>

      {isDropdown && (
        <div
          id="close"
          onClick={(e) => {
            console.log("close", e.target.id);
            if (e.target.id == "close") {
              setIsDropdown(false);
            }
          }}
          className="popup-container"
        >
          <div id="open" className="add-meal-method">
            {!isRecipeLoading ? (
              <input
                readOnly
                onPaste={(e) => {
                  e.preventDefault(); // Prevent the default paste action
                  const pastedData = e.clipboardData.getData("text"); // Get the pasted text
                  handleSearchByUrl(pastedData); // Call the function with the pasted data
                }}
                placeholder="Copy and Paste Recipe URL"
              ></input>
            ) : (
              <img className="input-loading-placeholder" src={loadingIcon} />
            )}
            OR
            <button onClick={() => setAddMethod("manual")}>Add Manually</button>
            <button
              onClick={() => setIsDropdown()}
              className="exit-button-method"
            >
              <img src={xIcon} />
            </button>
            {isError && (
              <div className="error-popup">
                <strong>Error: </strong>
                {isError}
              </div>
            )}
          </div>
          {addMethod == "manual" && (
            <AddMealOption
              mealOptions={mealOptions}
              popupRef={popupRef2}
              setMealOptions={setMealOptions}
              // editMeal={{ index: index, meal: meal }}
              setIsDropdown={setIsDropdown}
              styling={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
