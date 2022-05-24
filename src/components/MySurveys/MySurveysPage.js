import styles from "./MySurveysPage.module.css";
import Navbar from "../navbar/Navbar";
import SearchBar from "../SearchBar/SearchBar";
import SurveyCard from "../SurveyCard/SurveyCard";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabaseClient } from "../../lib/client";
import createSurveyIcon from "../../assets/create_survey_img.png";

function MySurveys() {
  const [numSurveys, setNumSurveys] = useState(2);
  const [surveys, setSurveys] = useState([]);

  const fetchMySurveys = async () => {
    const { data: surveys, error } = await supabaseClient
      .from("surveys")
      .select("*")
      .match({ published_by: "E0789289" }); //dummy nusid

    if (error) {
      console.log(error);
    }

    setNumSurveys(surveys.length);
    setSurveys(surveys);
  };

  useEffect(() => {
    fetchMySurveys();
  }, []);

  const renderMySurveys = () => {
    return surveys.map((survey) => {
      return (
        <SurveyCard
          img={survey.photo}
          title={survey.title}
          description={survey.description}
        />
      );
    });
  };

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
          {renderMySurveys()}
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
      onClick={() => navigate("/mysurveys/create-survey")}
    >
      <img className={styles.surveyCardImage} src={createSurveyIcon} alt="" />
      <p className={styles.surveyCardText}>Create new survey</p>
    </button>
  );
}

export default MySurveys;
