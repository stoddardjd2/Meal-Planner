import { useEffect, useState } from "react";

export default function QuickAddAnalyzer({ setFormInput }) {
  const [textareaValue, setTextareaValue] = useState("313");
  const [rows, setRows] = useState();
  const [ingredientsInfo, setIngredientsInfo] = useState([]);

  function handleSubmit() {
    // Split the text by newline characters and filter out empty lines
    const rows = textareaValue.split("\n").filter((line) => line.trim() !== "");

    // setIngredientsInfo((prev) => {
    //     return {
    //       ...prev,
    //       [index]: {
    //         ...prev[index],
    //         name: "FETCH NAME",
    //         image: "FETCH IMG",
    //       },
    //     };
    //   });

    // Count the number of rows
    // const rowCount = rows.length;
    rows.map((row, index) => {
      if (row) {
        const quantity = getQuantity(row);
        const units = getUnits(row);
        const name = getName(row);
        setFormInput((prev) => {
          const copy = [...prev.ingredients];
          copy.splice(index, 1, {
            name,
            quantity,
            units,
          });
          return {
            ...prev,
            ingredients: [...copy],
          };
        });

        console.log("name", name);
        console.log(quantity, units, name);
      }
    });
  }

  function handleTextareaChange(e) {
    setTextareaValue(e.target.value);
  }

  function getQuantity(str) {
    // Regular expression to match integers and common fractional characters (e.g., ½, ⅓, etc.)
    const numberAndFractionRegex = /-?\d+|[¼-¾⅐-⅟]/g;
    const matches = str.match(numberAndFractionRegex);
    // Map to convert Unicode fractions to decimal values
    const fractionMap = {
      "¼": 0.25,
      "½": 0.5,
      "¾": 0.75,
      "⅓": 1 / 3,
      "⅔": 2 / 3,
      "⅕": 1 / 5,
      "⅖": 2 / 5,
      "⅗": 3 / 5,
      "⅘": 4 / 5,
      "⅙": 1 / 6,
      "⅚": 5 / 6,
      "⅛": 1 / 8,
      "⅜": 3 / 8,
      "⅝": 5 / 8,
      "⅞": 7 / 8,
      "⅐": 1 / 7,
      "⅑": 1 / 9,
      "⅒": 1 / 10,
    };
    const matchesArr = matches
      ? matches.map((match) => fractionMap[match] || Number(match))
      : [];
    //add all units from array:
    return matchesArr.reduce((sum, num) => sum + num, 0);
  }
  function getUnits(str) {
    // Regular expression to match numbers (integers or decimals) followed by cooking units
    const regex =
      /-cup|cups|tablespoon|tablespoons|tbsp|teaspoon|teaspoons|tsp|gram|grams|g|kilogram|kilograms|kg|milliliter|milliliters|ml|liter|liters|L|ounce|ounces|oz|pound|pounds|lb|lbs|pinch|dash|pint|pints|quart|quarts/g;

    const matches = str.match(regex);
    //return first match in row
    return matches ? matches[0] : undefined;
  }

  //   for getting name:
  function removeUnitsAndNumbers(str) {
    // Regular expressions for units and numbers with word boundaries
    const unitsRegex =
      /\b-?(cup|cups|tablespoon|tablespoons|tbsp|teaspoon|teaspoons|tsp|gram|grams|g|kilogram|kilograms|kg|milliliter|milliliters|ml|liter|liters|L|ounce|ounces|oz|pound|pounds|lb|lbs|pinch|dash|pint|pints|quart|quarts)\b/g;
    const numbersRegex = /\b-?\d+|[¼-¾⅐-⅟]\b/g;

    // Combine both regex into a single regex with word boundaries
    const combinedRegex = new RegExp(
      `${unitsRegex.source}|${numbersRegex.source}`,
      "g"
    );

    // Remove units and numbers
    str = str.replace(combinedRegex, "").replace(/\s+/g, " ").trim();

    // Remove any non-alphabetic characters
    return str.replace(/[^a-zA-Z\s]/g, ""); // Retain spaces between words
  }

  function getName(str, index) {
    const foodName = removeUnitsAndNumbers(str);
    console.log("foodName", foodName);
    console.log("fetch time!", foodName);
    return foodName;

    const apiKey = "2f0681fc22e5432fb1120dde6513b6d8"; // Replace with your Spoonacular API key
    // fetch(
    //   `https://api.spoonacular.com/food/ingredients/search?query=${foodName}&apiKey=${apiKey}`
    // )
    //   .then((res) => res.json())
    //   .then((data) => {
    //     if (data.results && data.results.length > 0) {
    //       console.log(data.results[0]); // Log the first result
    //       setIngredientsInfo((prev) => {
    //         const copy = [...prev];
    //         copy.splice(index, 1, {
    //           ...prev[index],
    //           name: data.results[0].name,
    //           image: data.results[0].image,
    //         });
    //         return copy;
    //       });
    //     } else {
    //       console.log("No food details found.");
    //     }
    //   });

    // Example usage
    // fetchFoodDetails("apple");
    // gets name by removing units and quantity
  }

  return (
    <div className="QuickAddAnaylzer">
      <textarea
        value={textareaValue}
        onChange={handleTextareaChange}
      ></textarea>
      <button onClick={handleSubmit}>Submit</button>
      {/* 
      <div style={{ backgroundColor: "grey" }}>
        <div className="IngredientRow">
          <input disabled={true} placeholder="Name"></input>
          <input disabled={true} placeholder="Quantity"></input>
          <input disabled={true} placeholder="Units"></input>
        </div>
        {ingredientsInfo.map((ingredient, index) => {
          {
            console.log("ingredientsInfo", ingredientsInfo);
          }
          return (
            <IngredientRow
              key={index}
              ingredient={ingredient}
              setIngredientsInfo={setIngredientsInfo}
            />
          );
        })}
      </div> */}
    </div>
  );
}

// function IngredientRow({ ingredient, setIngredientsInfo }) {
//   function handleIngredientsInputChange() {
//     setIngredientsInfo((prev) => {
//       return prev;
//     });
//   }
//   return (
//     <div className="IngredientRow">
//       <input
//         value={ingredient.name}
//         onChange={() => handleIngredientsInputChange()}
//       ></input>
//       <input
//         value={ingredient.quantity}
//         onChange={() => handleIngredientsInputChange()}
//       ></input>
//       <input
//         value={ingredient.units}
//         onChange={() => handleIngredientsInputChange()}
//       ></input>
//     </div>
//   );
// }
