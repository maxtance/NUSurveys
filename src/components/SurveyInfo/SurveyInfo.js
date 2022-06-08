import styles from "./SurveyInfo.module.css";
import Navbar from "../navbar/Navbar";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabaseClient } from "../../lib/client";

// Things left to implement:
// 1. fetch image
// 2. For owner
//     a. Link to edit listing
//     b. Mark listing as closed
//     c. Delete listing
// 3. For surveyor
//     a. Add to wishlist
//     b. Mark survey as complete

function SurveyInfo() {
  let { surveyId } = useParams();
  const [surveys, setSurveys] = useState([]);
  const [genderEligibility, setGenderEligibility] = useState({});
  const [ageEligibility, setAgeEligibility] = useState({});
  const [ethnicityEligibility, setEthnicityEligibility] = useState([]);

  const userId = "E0789289"; // dummmy nusnetid

  const fetchSurveyInfo = async () => {
    const { data: surveys, error } = await supabaseClient
      .from("surveys")
      .select(
        `
        published_by,
        title, 
        description, 
        surveyType: survey_categories(cat_name), 
        remunerationType: remunerations(category_id(cat_name)),
        remunerationAmount: remunerations(amount),
        other_eligibility_requirements,
        userName: users!surveys_published_by_fkey(full_name),
        email: users!surveys_published_by_fkey(email),
        link
        `
      )
      .eq("id", surveyId);

    if (error) {
      console.log(error);
    }

    setSurveys(surveys);
  };

  const fetchGenderEligibility = async () => {
    const { data: genderEligibility, error } = await supabaseClient
      .from("gender_eligibilities")
      .select("genderEligibility: gender_eligibility_categories(name)")
      .eq("survey_id", surveyId);

    if (error) {
      console.log(error);
    }

    setGenderEligibility(genderEligibility[0]);
  };

  const fetchAgeEligibility = async () => {
    const { data: ageEligibility, error } = await supabaseClient
      .from("age_eligibilities")
      .select(`min_age, max_age`)
      .eq("survey_id", surveyId);

    if (error) {
      console.log(error);
    }

    setAgeEligibility(ageEligibility[0]);
  };

  const fetchEthnicityEligibility = async () => {
    const { data: ethnicityEligibility, error } = await supabaseClient
      .from("ethnicity_eligibilities")
      .select("ethnicityEligibility: ethnicities(name)")
      .eq("survey_id", surveyId);

    if (error) {
      console.log(error);
    }

    setEthnicityEligibility(ethnicityEligibility);
  };

  useEffect(() => {
    fetchSurveyInfo();
    fetchGenderEligibility();
    fetchAgeEligibility();
    fetchEthnicityEligibility();
  }, []);

  if (surveys.length === 0) {
    return <div>Survey does not exist!</div>;
  }
  let survey = surveys[0];

  return (
    <>
      <Navbar />
      <div className={`container-fluid pt-5 pb-5 ${styles.mainContent}`}>
        <div className={`offset-md-1 row pb-3 ${styles.title}`}>
          {survey.title}
        </div>
        <div className="row">
          <div className="offset-md-1 col-md-6">
            <img
              className={styles.surveyImg}
              src="https://loremflickr.com/269/389"
              alt=""
              height="300"
            />
            <div>
              <h3 className={styles.header}>About the study</h3>
              <p>{survey.description}</p>
              <p>
                <ul className={styles.noBullets}>
                  <li>
                    <span className={styles.eligibilities}>
                      Type of Survey:
                    </span>{" "}
                    {survey.surveyType.cat_name}
                  </li>
                  <li>
                    <span className={styles.eligibilities}>
                      Remuneration Type:{" "}
                    </span>
                    {!survey.remunerationType
                      ? "No remuneration given"
                      : survey.remunerationType.category_id.cat_name}
                  </li>
                  <li>
                    <span className={styles.eligibilities}>
                      Remuneration Amount:{" "}
                    </span>
                    {!survey.remunerationAmount
                      ? "Nil"
                      : survey.remunerationAmount.amount}
                  </li>
                </ul>
              </p>
            </div>
            <div>
              <h3 className={styles.header}>Eligibility</h3>
              <p>
                <ul className={styles.noBullets}>
                  <li>
                    <span className={styles.eligibilities}>Gender: </span>
                    {genderEligibility.genderEligibility?.name}
                  </li>
                  <li>
                    <span className={styles.eligibilities}>Ethnicity: </span>
                    {ethnicityEligibility.length === 0
                      ? "All"
                      : ethnicityEligibility.map(
                          (ethnicity, index) =>
                            ethnicity.ethnicityEligibility.name +
                            (index ? "" : ", ")
                        )}
                  </li>
                  <li>
                    <span className={styles.eligibilities}>Minimum Age: </span>
                    {!ageEligibility || !ageEligibility.min_age
                      ? "Nil"
                      : ageEligibility.min_age}
                  </li>
                  <li>
                    <span className={styles.eligibilities}>Maximum Age: </span>
                    {!ageEligibility || !ageEligibility.max_age
                      ? "Nil"
                      : ageEligibility.max_age}
                  </li>
                  <li>
                    <span className={styles.eligibilities}>
                      Other Requirements:{" "}
                    </span>
                    {!survey.other_eligibility_requirements
                      ? "Nil"
                      : survey.other_eligibility_requirements}
                  </li>
                </ul>
              </p>
            </div>
            <a
              className="btn btn-primary mt-3"
              href={survey.link}
              target="_blank"
              rel="noreferrer noopener"
              role="button"
            >
              Link to survey
            </a>
          </div>
          <div className="offset-md-1 col-md-4">
            {/* Only have this component if nusnetid don't match */}
            {userId !== survey.published_by ? (
              <div className={styles.buttons}>
                <button type="button" className="btn btn-primary">
                  Add to Wishlist
                </button>
                <button type="button" className="btn btn-primary">
                  Mark as Completed
                </button>
              </div>
            ) : (
              <></>
            )}
            <div className={styles.cards}>
              {/* Only have this component if nusnetid matches */}
              {userId === survey.published_by ? (
                <div className="card mb-5">
                  <div className={`card-header ${styles.cardHeader}`}>
                    MY LISTING
                  </div>
                  <div className="card-body">
                    <p className="card-text">
                      <ul className={styles.noBullets}>
                        <li>Edit listing</li>
                        <li>Mark listing as closed</li>
                        <li>Delete listing</li>
                      </ul>
                    </p>
                  </div>
                </div>
              ) : (
                <></>
              )}
              <div className="card pb-3">
                <div className={`card-header ${styles.cardHeader}`}>
                  PUBLISHER'S CONTACT
                </div>
                <div className="card-body">
                  <p className="card-text">
                    <span className={styles.contactName}>
                      {survey.userName.full_name}
                    </span>{" "}
                    <br />
                    {survey.email.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SurveyInfo;
