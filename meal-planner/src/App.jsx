import { useEffect, useState, useRef } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
// import DateCalendarValue from "./components/DateCalendarValue";
import Drag from "./components/Drag";
import Calendar from "./components/calendar/Calendar";
import MealOptions from "./components/meal-options/MealOptions";
import AddedMeals from "./components/added-meals/AddedMeals";
import CalendarGrid from "./components/CalendarGrid";
import ShoppingList from "./components/shopping-list/ShoppingList";
import MealsWithSharedIngredients from "./components/meals-with-shared-ingredients/MealsWithSharedIngredients";
function App() {
  // use Name as unique identifier. Prevent creating meals with duplicate names

  const draggedValueRef = useRef(""); // Use ref to store the dragged element's value
  const [mealOptions, setMealOptions] = useState([
    {
      name: "Cereal",
      link: "",
      servings: undefined,
      prepTimeMin: undefined,
      ingredients: [
        { name: "soda", quantity: "1", units: undefined },
        { name: "milk", quantity: "12", units: "fl/oz" },
        { name: "cereal", quantity: "1", units: "cup" },
      ],
      multiplier: 1,
      cost: undefined,
    },
    {
      name: "Biscuit",
      link: "",
      servings: undefined,
      prepTimeMin: undefined,
      ingredients: [
        { name: "soda", quantity: "1", units: undefined },
        { name: "buns", quantity: "2", units: undefined },
      ],
      multiplier: 1,
      cost: undefined,
    },
    {
      name: "Burger",
      link: "",
      servings: 4,
      prepTimeMin: 25,
      ingredients: [
        { name: "soda", quantity: "1", units: undefined },
        { name: "buns", quantity: "1", units: undefined },
        { name: "tomato", quantity: "2", units: undefined },
        { name: "patty", quantity: "2", units: "lbs" },
      ],
      multiplier: 1,
      cost: 14,
    },
  ]);
  const [addedMeals, setAddedMeals] = useState([]);

  const mainIngredients = () => {
    const ingredientCount = addedMeals.reduce((acc, recipe) => {
      recipe.ingredients.forEach((ingredient) => {
        const { name, quantity, units } = ingredient;
        let quantityMultiplied;
        quantityMultiplied = +quantity * +recipe.multiplier;

        // Initialize the ingredient if not in the accumulator
        if (!acc[name]) {
          acc[name] = { count: 0, quantities: {} };
        }

        // Increment count of the ingredient name appearance
        acc[name].count += 1;

        // If units are undefined, sum the quantity
        if (!units) {
          acc[name].quantities["undefined"] =
            (acc[name].quantities["undefined"] || 0) +
            parseFloat(quantityMultiplied);
        } else {
          // If units are defined, store them separately
          acc[name].quantities[units] =
            (acc[name].quantities[units] || 0) + parseFloat(quantityMultiplied);
        }
      });

      return acc;
    }, {});

    // Step 2: Sort the ingredientCount object by name and count
    const sortedIngredients = Object.entries(ingredientCount)
      .sort((a, b) => b[1].count - a[1].count) // Sort by count descending
      .reduce((acc, [name, { count, quantities }]) => {
        acc[name] = { count, quantities };
        return acc;
      }, {});

    // Convert object into an array of objects
    const arrayOfObjects = Object.keys(sortedIngredients).map((key) => {
      return {
        name: key,
        ...sortedIngredients[key],
      };
    });

    // Sort array by the `count` property in descending order
    const sortedIngredientsArray = arrayOfObjects.sort(
      (a, b) => b.count - a.count
    );

    return sortedIngredientsArray;
  };
  const mainIngredientsArr = mainIngredients();

  return (
    <div className="app-container">
      {/* <Drag /> */}
      <div className="split-container">
        <div>
          <MealOptions
            mealOptions={mealOptions}
            setMealOptions={setMealOptions}
            draggedValueRef={draggedValueRef}
          />
        </div>
        <div className="right-split">
          <AddedMeals
            mealOptions={mealOptions}
            addedMeals={addedMeals}
            mainIngredientsArr={mainIngredientsArr}
          />
          <ShoppingList
            addedMeals={addedMeals}
            mainIngredientsArr={mainIngredientsArr}
          />
          <MealsWithSharedIngredients
            mealOptions={mealOptions}
            mainIngredientsArr={mainIngredientsArr}
            addedMeals={addedMeals}
            draggedValueRef={draggedValueRef}
          />
        </div>
      </div>

      <Calendar
        addedMeals={addedMeals}
        setAddedMeals={setAddedMeals}
        mealOptions={mealOptions}
        draggedValueRef={draggedValueRef}
      />
      {/* <CalendarGrid
        mealOptions={mealOptions}
        draggedValueRef={draggedValueRef}
      /> */}
    </div>
  );
}

export default App;
