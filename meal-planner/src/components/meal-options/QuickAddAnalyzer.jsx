import { useEffect, useState } from "react";

export default function QuickAddAnalyzer({
  changesTracker,
  setChangesTracker,
  setFormInput,
}) {
  const [textareaValue, setTextareaValue] = useState("");
  function handleUndo(e) {
    e.preventDefault();

    setFormInput((prev) => {
      const copy = [...prev.ingredients];
      copy.splice(0, changesTracker[0]);
      return {
        ...prev,
        ingredients: copy,
      };
    });
    setChangesTracker((prev) => {
      const copy = [...prev];
      copy.shift();
      return copy;
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Split the text by newline characters and filter out empty lines
    const rows = textareaValue.split("\n").filter((line) => line.trim() !== "");
    console.log("ROWS", rows);
    rows.map((row, index) => {
      if (row) {
        const quantity = getQuantity(row);
        const units = getUnits(row);
        const name = getName(row);
        setFormInput((prev) => {
          const copy = [...prev.ingredients];
          copy.push({
            name,
            quantity,
            units,
          });
          return {
            ...prev,
            ingredients: copy,
          };
        });
      }
    });
    if (!(rows.length == 0)) {
      setChangesTracker((prev) => {
        const copy = [...prev];
        copy.unshift(rows.length);
        return copy;
      });
    }
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
  }

  return (
    <div className="QuickAddAnaylzer">
      <textarea
        placeholder="Copy and paste ingredients here"
        value={textareaValue}
        onChange={handleTextareaChange}
      ></textarea>
      <button
        style={textareaValue ? { opacity: "1" } : {}}
        className="anaylze-button quickAdd-btn"
        onClick={handleSubmit}
      >
        Submit
      </button>
      {console.log("changes tracker", changesTracker)}
      {!(changesTracker.length == 0) && (
        <button className="undo quickAdd-btn" onClick={handleUndo}>
          Undo
        </button>
      )}
    </div>
  );
}
