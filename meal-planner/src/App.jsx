import { useEffect, useState, useRef } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
// import DateCalendarValue from "./components/DateCalendarValue";
import Drag from "./components/Drag";
import Calendar from "./components/calendar/Calendar";
import MealOptions from "./components/meal-options/MealOptions";
function App() {
  const draggedValueRef = useRef('');  // Use ref to store the dragged element's value
  const [mealOptions, setMealOptions] = useState([
    {
      name: "test",
      link: "",
      servings: undefined,
      prepTimeMin: undefined,
      ingredients: [],
    },
    {
      name: "Burger",
      link: "",
      servings: 4,
      prepTimeMin: 25,
      ingredients: ["onions", "buns", "patty"],
    },
  ]);

  return (
    <div className="app-container">
      {/* <Drag /> */}
      <MealOptions mealOptions={mealOptions} setMealOptions={setMealOptions} draggedValueRef={draggedValueRef}/>
      <Calendar mealOptions={mealOptions} draggedValueRef={draggedValueRef} />
    </div>
  );
}

export default App;
