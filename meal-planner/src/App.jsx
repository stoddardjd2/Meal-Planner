import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
// import DateCalendarValue from "./components/DateCalendarValue";
import Calendar from "./components/calendar/Calendar";
import MealOptions from "./components/meal-options/MealOptions";
function App() {
  const [count, setCount] = useState(0);
  return (
    <div className="app-container">
      <MealOptions />
      <Calendar />
    </div>
  );
}

export default App;
