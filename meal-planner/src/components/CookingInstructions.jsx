import xIcon from "../assets/x.svg";
import { useRef, useEffect, useState } from "react";
import MealOptions from "./meal-options/MealOptions";
export default function CookingInstructions({
  instructionsRef,
  setIsPopup,
  isPopup,
  setMealOptions,
}) {
  const [newInstructionInput, setNewInstructionInput] = useState("");
  const [mealInstructions, setMealInstructions] = useState(
    isPopup.meal.instructions
  );
  useEffect(() => {
    setMealOptions((prev) => {
      console.log("MEA:S", prev);
      const mealIndex = prev.findIndex((meal, index) => {
        // get index of meal to update in mealOptions
        return meal.name == isPopup.meal.name;
      });
      const copy = [...prev];
      copy.splice(mealIndex, 1, {
        ...isPopup.meal,
        instructions: mealInstructions,
      });
      return copy;
    });
  }, [mealInstructions]);
  const textareaRef = useRef(null);
//   const handleInput = () => {
//     const textarea = textareaRef.current;
//     textarea.style.height = "auto"; // Reset height
//     textarea.style.height = `${textarea.scrollHeight}px`; // Set height based on content
//   };

//   useEffect(() => {
//     handleInput(); // Adjust height initially
//   }, []);
  function handleSubmitNewInput(e) {
    e.preventDefault();
    if (newInstructionInput) {
      setNewInstructionInput("");
      setMealInstructions((prev) => {
        return [...prev, newInstructionInput];
      });
    }
  }
  return (
    <div ref={instructionsRef} className="cooking-instructions-popup">
      <h3>Cooking Instructions</h3>
      <label htmlFor="add-step">Add Step:</label>
      <form onSubmit={handleSubmitNewInput}>
        <div className="input-flex">
          <input
            id={"add-step"}
            onChange={(e) => {
              setNewInstructionInput(e.target.value);
            }}
            className="new-instructions-input"
            value={newInstructionInput}
          ></input>
          <button onClick={handleSubmitNewInput} className="add-step-btn">
            Add
          </button>
        </div>
      </form>

      <div className="instructions-container">
        {mealInstructions.map((instruction, index) => {
          return (
            <div key={index} className="input-container">
              <li></li>
              <textarea
                // ref={textareaRef}
                // onInput={handleInput}
                onChange={(e) => {
                  setMealInstructions((prev) => {
                    const copy = [...prev];
                    copy.splice(index, 1, e.target.value);
                    return copy;
                  });
                }}
                className="instructions-input"
                value={instruction}
              ></textarea>
              <button onClick={()=>setMealInstructions(prev=>{
                const copy = [...prev]
                copy.splice(index, 1)
                return copy
            })} className="delete-instruction-btn">
                <img src={xIcon} />
              </button>
            </div>
          );
        })}
      </div>

      <button onClick={() => setIsPopup()} className="exit-popup-btn">
        <img src={xIcon} />
      </button>
    </div>
  );
}
