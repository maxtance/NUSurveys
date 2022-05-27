import styles from "./HomeBody.module.css";
import SearchBar from "../SearchBar/SearchBar";
import { useEffect, useState } from "react";
import { supabaseClient } from "../../lib/client";
import SurveyCard from "../SurveyCard/SurveyCard";

function HomeBody() {
  const [numSurveys, setNumSurveys] = useState(0);
  const [surveys, setSurveys] = useState([]);

  const fetchSurveyListings = async () => {
    const { data: surveys, error } = await supabaseClient
      .from("surveys")
      .select("*");

    if (error) {
      console.log(error);
    }

    // console.log(surveys);
    setNumSurveys(surveys.length);
    setSurveys(surveys.reverse());
  };

  useEffect(() => {
    fetchSurveyListings();
  }, []);

  const renderSurveys = () => {
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
      <div>
        <div className={styles.searchBarForm}>
          <SearchBar />
        </div>
        <div className="d-flex justify-content-between pb-3">
          <div className={styles.pageHeader}>
            Showing <span className={styles.numSurveysColor}>{numSurveys}</span>{" "}
            Survey Listing
            {numSurveys > 1 ? "s" : ""}
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
              Newest survey
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
              <li>
                <a class="dropdown-item" href="#">
                  Newest survey
                </a>
              </li>
              <li>
                <a class="dropdown-item" href="#">
                  Oldest survey
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className={styles.surveyListings}>{renderSurveys()}</div>
    </div>
  );
}

export default HomeBody;
