import styles from "./MySurveysPage.module.css";
import Navbar from "../navbar/Navbar";
import SearchBar from "../SearchBar/SearchBar";
import SurveyCard from "../SurveyCard/SurveyCard";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function MySurveys() {
  const [numSurveys, setNumSurveys] = useState(2);

  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <Navbar />
      </div>
      <div className={styles.mainContent}>
        <div className={styles.searchBarForm}>
          <SearchBar />
        </div>
        <p>
          You have {numSurveys} Ongoing Survey{numSurveys > 1 ? "s" : ""}
        </p>
        <div className={styles.mySurveys}>
          <MakeNewSurvey />
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
    </div>
  );
}

function MakeNewSurvey() {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className={styles.surveyCard}
      onClick={() => navigate("/create-survey")}
    >
      <img
        className={styles.surveyCardImage}
        src="https://loremflickr.com/340/300"
        alt=""
      />
      <p className={styles.surveyCardText}>Create new survey</p>
    </button>
  );
}

export default MySurveys;
