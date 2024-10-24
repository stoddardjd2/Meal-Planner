import wandIcon from "../../assets/wand.svg";
import nlp from "compromise";
import { useState } from "react";
export default function StandardizedNamesBtn({ formInput, setFormInput }) {
  const [isMouseOver, setIsMouseOver] = useState(false);
  //some words not detected as noun:
  const manuallyAddedNames = ["milk"];

  function handleClick() {
    console.log("magic on", formInput);
    const ingredientNamesArr = [];
    formInput.ingredients.map((ingredient) => {
      ingredientNamesArr.push(ingredient.name);
    });

    // remove all but nouns
    const filteredNames = ingredientNamesArr.map((name, index) => {
      let updatedName = "NONE";
      //if no nouns detected, keep default name
      if (manuallyAddedNames.includes(name.toLowerCase())) {
        console.log("INCLUDES")
        updatedName = name;
      } else {
        console.log("EKSE")
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
      console.log("updatedName", updatedName); // Output: ['fox', 'dog']
    });

    // const apiKey = "2f0681fc22e5432fb1120dde6513b6d8"; // Replace with your Spoonacular API key
    // ingredientNamesArr.map((name, index) => {
    //   fetch(
    //     `https://api.spoonacular.com/food/ingredients/search?query=${name}&apiKey=${apiKey}`
    //   )
    //     .then((res) => res.json())
    //     .then((data) => {
    //       if (data.results && data.results.length > 0) {
    //         console.log("res!", data.results[0]); // Log the first result
    //         setFormInput((prev) => {
    //           const copy = [...prev.ingredients];
    //           copy.splice(index, 1, {
    //             ...prev.ingredients[index],
    //             name: data.results[0].name,
    //           });
    //           return { ...prev, ingredients: copy };
    //         });
    //       } else {
    //         console.log("No food details found.");
    //       }
    //     });
    // });
  }

  return (
    <div
      onMouseOver={() => setIsMouseOver(true)}
      onMouseLeave={() => setIsMouseOver(false)}
      className="popup-button-container"
    >
      <button onClick={handleClick}>
        <img src={wandIcon} />
      </button>
      {isMouseOver && <div className="popup-hover">*Standardize names</div>}
    </div>
  );
}
