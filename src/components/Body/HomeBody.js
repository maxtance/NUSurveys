import styles from "./HomeBody.module.css";
import SearchBar from "../SearchBar/SearchBar";
import { useState } from "react";
import SurveyCard from "../SurveyCard/SurveyCard";

function HomeBody() {
  const [numSurveys, setNumSurveys] = useState(20);

  return (
    <div className={styles.container}>
      <div>
        <div className={styles.searchBarForm}>
          <SearchBar />
        </div>
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

export default HomeBody;
