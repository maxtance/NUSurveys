import styles from "./SearchBar.module.css";
import { useState } from "react";

function SearchBar() {
  const [search, setSearch] = useState("");
  const searchButtonPressed = () => {
    console.log(search);
    setSearch("");
  };

  return (
    <form>
      <input
        type="search"
        name="search-bar"
        placeholder="Search for keyword/tag"
        className={styles.searchBar}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button
        type="button"
        className={styles.searchBtn}
        onClick={searchButtonPressed}
      >
        Search
      </button>
    </form>
  );
}

export default SearchBar;
