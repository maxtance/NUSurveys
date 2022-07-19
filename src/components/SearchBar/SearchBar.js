import styles from "./SearchBar.module.css";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";

function SearchBar({ setKeyword }) {
  const { register, watch, setValue, handleSubmit } = useForm();

  const searchRef = useRef();
  searchRef.current = watch("search-bar");

  const ref = useRef();

  //const [search, setSearch] = useState("");
  const searchButtonPressed = () => {
    //console.log(searchRef.current);
    setKeyword(searchRef.current);
    //setSearch("");
  };

  const cancelButtonPressed = () => {
    setKeyword("");
    setValue("search-bar", "");
  };

  return (
    <form onSubmit={handleSubmit(searchButtonPressed)}>
      <input
        type="search"
        id="search"
        ref={ref}
        name="search-bar"
        {...register("search-bar")}
        placeholder="Search for keyword(s)"
        className={styles.searchBar}
        //value={search}
        //onChange={(e) => setKeyword(e.target.value)}
        // onsearch={searchButtonPressed}
      />
      <button
        type="button"
        className={styles.searchBtn}
        onClick={searchButtonPressed}
      >
        Search
      </button>
      <button
        type="button"
        className={styles.cancelBtn}
        onClick={cancelButtonPressed}
        disabled={searchRef.current === ""}
      >
        Cancel
      </button>
    </form>
  );
}

export default SearchBar;
