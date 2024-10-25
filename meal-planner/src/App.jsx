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
import MealOptionCard from "./components/meal-options/MealOptionCard";
import MealsWithSharedIngredients from "./components/meals-with-shared-ingredients/MealsWithSharedIngredients";
import SearchInput from "./components/SearchInput";
import CalendarV2 from "./components/calendar/CalendarV2";
import CalendarV3 from "./components/calendar/CalendarV3";
import CalendarV4 from "./components/calendar/CalendarV4";
import AddMealBtn from "./components/AddMealBtn";
function App() {
  // use Name as unique identifier. Prevent creating meals with duplicate names
  const colorOptions = [
    "#264653", // Deep Blue Teal
    "#2A9D8F", // Dark Aqua
    "#E76F51", // Warm Terracotta
    "#F4A261", // Soft Amber
    "#E9C46A", // Golden Yellow
    "#1D3557", // Midnight Blue
    "#457B9D", // Slate Blue
    "#8D99AE", // Gentle Slate
    "#6A4C93", // Rich Purple
    "#FF6F61", // Vibrant Coral
    "#D62828", // Fiery Red
    "#264653", // Deep Blue Green
  ];

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

  const [mealNamesSearch, setMealNamesSearch] = useState();
  const [addedMeals, setAddedMeals] = useState([]);

  const getAssignments = () => {
    const assignmentsArr = mealOptions.map((meal, index) => {
      console.log("adding to arr", meal.name, colorOptions[index]);
      return { [meal.name]: colorOptions[index] };
    });
    console.log("assignmentsArr", assignmentsArr);
    const result = assignmentsArr.reduce((acc, item) => {
      const key = Object.keys(item)[0]; // Get the single key in each object
      acc[key] = { color: item[key] }; // Create a nested object with "color" as the key
      return acc;
    }, {});
    return result;
  };
  const assignments = getAssignments();

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

  // FOR RECCOMMENED COLUMN:
  function getMealByName(name) {
    let match = {};
    mealOptions.map((meal) => {
      if (meal.name == name) {
        match = meal;
      }
    });
    return match;
  }

  // filter out meals that have already been added if enabled:
  // Function to get non-matching objects based on the `name` property
  const getNonMatchingObjects = (arr1, arr2) => {
    return [
      ...arr1.filter(
        (item1) => !arr2.some((item2) => item1.name === item2.name)
      ),
      ...arr2.filter(
        (item2) => !arr1.some((item1) => item1.name === item2.name)
      ),
    ];
  };

  const getMealOptionsFiltered = () => {
    return getNonMatchingObjects(mealOptions, addedMeals);
  };
  const getMealsWithUsedIngredients = () => {
    // results corresponds with position of mainIngredientsArr. For each ingredient, shows all meals that use that ingredient
    const ingredientNamesArr = mainIngredientsArr.map((ingredient) => {
      return ingredient.name;
    });
    return ingredientNamesArr.map((name) => {
      const unfilterdArray = getMealOptionsFiltered().map((meal, index) => {
        const mealIngredientsArr = meal.ingredients.map((ingredient) => {
          return ingredient.name;
        });
        if (mealIngredientsArr.includes(name)) {
          // return { name: meal.name, index: index };
          return meal.name;
        }
      });
      const filteredArray = unfilterdArray.filter(
        (element) => element !== undefined
      );
      return filteredArray;
    });
  };
  const mealsWithUsedIngredients = getMealsWithUsedIngredients();
  const reccommendedMealsArr = [...new Set(mealsWithUsedIngredients.flat())];
  // END
  return (
    <div className="app-container">
      {/* <Drag /> */}
      <div className="split-container">
        <div className="split-1">
          <h2>Your Meals</h2>

          <div className="meals-action-container">
            <SearchInput
              mealOptions={mealOptions}
              setMealNamesSearch={setMealNamesSearch}
            />
          </div>
          <div className="meal-columns-header-container">
            <div className="meal-header-container">
              <h2 className="sticky">Meals</h2>
              
            </div>
            <h2 className="recommended-header">Recommended</h2>
          </div>

          <div className="meal-columns-container">
            <div className="left-meals-column">
            <div className="sticky" style={{ marginRight: "3px", zIndex:"5" }}>
                <AddMealBtn
                  mealOptions={mealOptions}
                  setMealOptions={setMealOptions}
                />
              </div>
              <MealOptions
                mealOptions={mealOptions}
                mealNamesSearch={mealNamesSearch}
                setMealOptions={setMealOptions}
                draggedValueRef={draggedValueRef}
                assignments={assignments}
              />
            </div>

            <div className="meal-option-cards-grid sticky">
              {reccommendedMealsArr.map((name, index) => {
                return (
                  <MealOptionCard
                    key={"recommended-" + index}
                    meal={getMealByName(name)}
                    previewEnabled={true}
                    mealOptions={reccommendedMealsArr}
                    setMealOptions={setMealOptions}
                    draggedValueRef={draggedValueRef}
                    // assignments={assignments}
                    styling={{ backgroundColor: `${assignments[name].color}` }}
                  />
                );
              })}
            </div>
          </div>
        </div>
        <div className="left-split">
          {/* <Calendar
            addedMeals={addedMeals}
            setAddedMeals={setAddedMeals}
            mealOptions={mealOptions}
            draggedValueRef={draggedValueRef}
          /> */}
          <CalendarV2
            addedMeals={addedMeals}
            setAddedMeals={setAddedMeals}
            mealOptions={mealOptions}
            draggedValueRef={draggedValueRef}
            assignments={assignments}
          />
          {/* <CalendarV3
            draggedValueRef={draggedValueRef}
            addedMeals={addedMeals}
            setAddedMeals={setAddedMeals}
            mealOptions={mealOptions}
          /> */}
          {/* <CalendarV4 /> */}
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
            assignments={assignments}
          />
        </div>
      </div>

      {/* <CalendarGrid
        mealOptions={mealOptions}
        draggedValueRef={draggedValueRef}
      /> */}
    </div>
  );
}

export default App;
