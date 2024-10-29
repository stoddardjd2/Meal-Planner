import searchIcon from "../assets/search.svg";
export default function SearchInput({ setMealNamesSearch, mealOptions }) {
  function handleSearchInput(e) {
    const searchValue = e.target.value;
    let searchResults = [];
    if (searchValue) {
      mealOptions.map((option) => {
        if (option.name.toLowerCase().includes(searchValue.toLowerCase())) {
          searchResults.push(option.name);
        }
      });
      setMealNamesSearch(searchResults);
    } else {
      setMealNamesSearch();
    }
  }
  return (
    <div className="searchInput">
      <label htmlFor="search-your-meals">
        <img src={searchIcon} />
      </label>
      <input
        id="search-your-meals"
        onChange={handleSearchInput}
        placeholder="Seach your meals"
      ></input>
    </div>
  );
}
