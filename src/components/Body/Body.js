import styles from "./Body.module.css";
import { useState } from "react";

function Body() {
  const [search, setSearch] = useState("");
  const [numSurveys, setNumSurveys] = useState(20);

  const searchButtonPressed = () => {
    console.log(search);
    setSearch("");
  };

  return (
    <div className={styles.container}>
      <form className={styles.searchBarForm}>
        <input
          type="search"
          name="search-bar"
          placeholder="Search for keyword/tag"
          className={styles.searchBar}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="button" onClick={searchButtonPressed}>
          Search
        </button>
      </form>
      <div>
        <p>
          Showing {numSurveys} Survey Listing{numSurveys > 1 ? "s" : ""}
        </p>
      </div>
      <div className={styles.surveyListings}>
        <SurveyCard
          img="https://loremflickr.com/640/360"
          title="Cat survey"
          description="This is just an example description"
        />
        <SurveyCard
          img="https://loremflickr.com/400/360"
          title="More Cat survey"
          description="This is just an example description"
        />
        <SurveyCard
          img="https://loremflickr.com/640/300"
          title="Even MORE Cat survey"
          description="This is just an example description"
        />
        <SurveyCard
          img="https://loremflickr.com/640/300"
          title="Even MORE Cat survey"
          description="This is just an example description"
        />
      </div>
    </div>
  );
}

function SurveyCard(props) {
  return (
    <div className={styles.surveyCard}>
      <div className={styles.surveyCard__body}>
        <img src={props.img} className={styles.surveyCard__image} alt="" />
        <h2 className={styles.surveyCard__title}>{props.title}</h2>
        <p className={styles.surveyCard__description}>{props.description}</p>
      </div>
      <button className={styles.surveyCard__btn}>More information</button>
    </div>
  );
}

export default Body;
