import styles from "./HomeBody.module.css";
import SearchBar from "../SearchBar/SearchBar";
import { useEffect, useState } from "react";
import { supabaseClient } from "../../lib/client";
import SurveyCard from "../SurveyCard/SurveyCard";
import { getDate } from "../createSurvey/CreateSurvey";

function HomeBody({
  filterCriteria,
}) {
  const userId = 1; // dummyId

  const [numSurveys, setNumSurveys] = useState(0);
  const [surveys, setSurveys] = useState([]);
  const [wishlists, setWishlists] = useState([]);
  const [sortBy, setSortBy] = useState("Newest survey");

  useEffect(() => {
    fetchSurveyListings();
  }, [filterCriteria]);

  function handleSortBy(sortValue) {
    setSortBy(sortValue);
    if (sortValue === "Newest survey") {
      surveys.sort((a, b) => b.id - a.id);
    } else if (sortValue === "Oldest survey") {
      surveys.sort((a, b) => a.id - b.id);
    } else {
      surveys.sort((a, b) => a.closing_date.localeCompare(b.closing_date));
    }
  }

  const fetchSurveyListings = async () => {
    let filterByType = false;
    let filterByStatus = false;
    let filterByRemuneration = false;

    let query = supabaseClient
      .from('surveys')
      .select('*, remunerations!inner(*, remuneration_categories!inner(*))');

    if (filterCriteria["survey_categories"].length !== 0) {
      filterByType = true;
    }
    if (filterCriteria["remuneration_categories"].length !== 0) {
      filterByRemuneration = true;
    }
    if (filterCriteria["status"].length === 1) {
      filterByStatus = true;
    }

    //TODO: add filter logic here
    if (filterByType) {
      query = query.in("category_id", filterCriteria["survey_categories"]);
    }

    if (filterByRemuneration) {
      query = query.in(
        "remunerations.remuneration_categories.id",
        filterCriteria["remuneration_categories"]
      );
    }

    if (filterByStatus) {
      if (filterCriteria["status"][0] == "ongoing") {
        query = query.gte("closing_date", getDate(0));
      } else {
        query = query.lt("closing_date", getDate(0));
      }
    }

    const { data: surveys, error } = await query
      .order("id", { ascending: false });
    
    if (error) {
      console.log(error);
    } else {
      console.log(surveys);
    }

    const { data: wishlists, error: wishlistsError } = await supabaseClient
      .from("wishlisted_surveys")
      .select("*")
      .eq("user_id", String(userId));

    surveys.map((survey) => {
      const match = wishlists.filter(
        (wishlist) => wishlist.survey_id === survey.id
      );
      if (match.length === 0) {
        survey.isWishlisted = false;
      } else {
        survey.isWishlisted = true;
      }
      return survey;
    });

    console.log(surveys);

    setNumSurveys(surveys.length);
    setSurveys(surveys);
  };

  const renderSurveys = () => {
    return surveys.map((survey) => {
      return <SurveyCard survey={survey} />;
    });
  };

  return (
    <div className={styles.container}>
      <div>
        {console.log("rerender")}
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
              {sortBy}
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
              <li>
                <button
                  type="button"
                  class="dropdown-item"
                  onClick={() => handleSortBy("Newest survey")}
                >
                  Newest survey
                </button>
              </li>
              <li>
                <button
                  type="button"
                  class="dropdown-item"
                  onClick={() => handleSortBy("Oldest survey")}
                >
                  Oldest survey
                </button>
              </li>
              <li>
                <button
                  type="button"
                  class="dropdown-item"
                  onClick={() => handleSortBy("Closing first")}
                >
                  Closing first
                </button>
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
