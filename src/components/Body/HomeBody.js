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
    setSurveys(surveys);
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
        <p>
          Showing {numSurveys} Survey Listing{numSurveys > 1 ? "s" : ""}
        </p>
      </div>
      <div className={styles.surveyListings}>
        <SurveyCard
          img="https://loremflickr.com/640/360"
          title="Test survey"
          description="This is a test example"
        />
        {renderSurveys()}
      </div>
    </div>
  );
}

export default HomeBody;
