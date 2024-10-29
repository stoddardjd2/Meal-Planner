export default function removeUnitsAndNumbers(str) {
  //   for getting name:
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
