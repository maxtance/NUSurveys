import styles from "./SearchBar.module.css";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";

function SearchBar({ setKeyword }) {
  const {
    register,
    watch,
  } = useForm();

  const searchRef = useRef();
  searchRef.current = watch("search-bar");

  //const [search, setSearch] = useState("");
  const searchButtonPressed = () => {
    setKeyword(searchRef.current);
    //setSearch("");
  };

  return (
    <form>
      <input
        type="search"
        name="search-bar"
        {...register("search-bar")}
        placeholder="Search for keyword/tag"
        className={styles.searchBar}
        //value={search}
        //onChange={(e) => setKeyword(e.target.value)}
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
