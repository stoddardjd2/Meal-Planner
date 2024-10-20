import "./MealOptions.css";
import AddNewMealOption from "./AddMealOption";
import { useEffect, useState } from "react";
export default function MealOptions() {
  const [mealOptions, setMealOptions] = useState([]);

  useEffect(() => {
    console.log("change!", mealOptions);
  }, [mealOptions]);
  return (
    <div>
      <h2>Options</h2>
      <AddNewMealOption setMealOptions={setMealOptions} />
      {mealOptions.map((meal, index) => {
        return <div key={index}>{meal.name}</div>;
      })}
    </div>
  );
}
