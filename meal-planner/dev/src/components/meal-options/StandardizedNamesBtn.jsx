import wandIcon from "../../assets/wand.svg";
import nlp from "compromise";
import { useState } from "react";
export default function StandardizedNamesBtn({ formInput, setFormInput }) {
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [wandEffect, setWandEffect] = useState(false);

  //some words not detected as noun:
  const manuallyAddedNames = ["milk"];

  function handleClick() {
    setWandEffect(true);
    setTimeout(() => setWandEffect(false), 500); // Reset after animation duration

    console.log("RUNNING")

    const ingredientNamesArr = [];
    formInput.ingredients.map((ingredient) => {
      ingredientNamesArr.push(ingredient.name);
    });

    // remove all but nouns
    ingredientNamesArr.map((name, index) => {
      let updatedName = "NONE";
      //if no nouns detected, keep default name
      if (manuallyAddedNames.includes(name.toLowerCase())) {
        updatedName = name;
      } else {
        let doc = nlp(name);
        let nouns = doc.nouns().out("array");
        updatedName = nouns[0];
      }
      setFormInput((prev) => {
        const copy = [...prev.ingredients];
        copy.splice(index, 1, {
          ...prev.ingredients[index],
          name: updatedName,
        });
        return { ...prev, ingredients: copy };
      });
    });
  }

  return (
    <div
      onMouseOver={() => setIsMouseOver(true)}
      onMouseLeave={() => setIsMouseOver(false)}
      className="popup-standardize-container"
    >
      <button  onClick={handleClick}>
        <img className={wandEffect ? "wandEffect" : ""} src={wandIcon} />
      </button>
      {isMouseOver && <div className="popup-hover">*Standardize names</div>}
    </div>
  );
}
