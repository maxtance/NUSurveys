import styles from "./MySurveysPage.module.css";
import Navbar from "../navbar/Navbar";
import SearchBar from "../SearchBar/SearchBar";
import SurveyCard from "../SurveyCard/SurveyCard";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabaseClient } from "../../lib/client";
import createSurveyIcon from "../../assets/create_survey_img.png";

function MySurveys() {
  const [numSurveys, setNumSurveys] = useState(0);
  const [surveys, setSurveys] = useState([]);

  const fetchMySurveys = async () => {
    const { data: surveys, error } = await supabaseClient
      .from("surveys")
      .select("*")
      .order("id", { ascending: false })
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
      return <SurveyCard survey={survey} />;
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
        <div className="d-flex justify-content-between pb-3">
          <div className={styles.pageHeader}>
            You have{" "}
            <span className={styles.numSurveysColor}>{numSurveys}</span> Ongoing
            Survey{numSurveys > 1 ? "s" : ""}
          </div>
          <div className="dropdown">
            <span className={styles.sortBy}>Sort by:</span>
            <button
              className={`btn dropdown-toggle btn-sm ${styles.btnWhite}`}
              type="button"
              id="dropdownMenuButton1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Ongoing survey
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
              <li>
                <a class="dropdown-item" href="#">
                  Ongoing survey
                </a>
              </li>
              <li>
                <a class="dropdown-item" href="#">
                  Last created
                </a>
              </li>
              <li>
                <a class="dropdown-item" href="#">
                  First created
                </a>
              </li>
              <li>
                <a class="dropdown-item" href="#">
                  Last edited
                </a>
              </li>
            </ul>
          </div>
        </div>
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
