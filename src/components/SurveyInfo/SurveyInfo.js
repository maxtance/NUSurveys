import styles from "./SurveyInfo.module.css";
import Navbar from "../navbar/Navbar";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabaseClient } from "../../lib/client";
import useBookmark from "../../helpers/useBookmark";
import useFetchUser from "../../helpers/useFetchUser";

// Things left to implement:
// 1. For owner
//     a. Mark listing as closed
//     b. Delete listing
// 2. For surveyor
//     a. Add to wishlist
//     b. Mark survey as complete

function SurveyInfo() {
  let { surveyId } = useParams();
  const { userInfo } = useFetchUser();
  const userId = userInfo?.id;

  const surveyInfo = useFetchListingInfo(surveyId);
  // console.log(surveyInfo);
  const [isBookmarked, setAndUpdateIsBookmarked] = useBookmark(
    surveyInfo.isWishlisted,
    surveyId
  );
  // console.log(surveyInfo.isWishlisted, isBookmarked);

  function toggleBookmark() {
    setAndUpdateIsBookmarked();
  }

  if (surveyInfo.isValidSurvey === null) {
    return <p>Loading survey info...</p>;
  } else if (!surveyInfo.isValidSurvey) {
    return <div>Survey does not exist!</div>;
  }

  return (
    <>
      <Navbar />
      <div className={`container-fluid pt-5 pb-5 ${styles.mainContent}`}>
        <div className={`offset-md-1 row pb-3 ${styles.title}`}>
          {surveyInfo.title}
        </div>
        <div className="row">
          <div className="offset-md-1 col-md-6">
            {surveyInfo.photoURL !== null ? (
              <img
                className={styles.surveyImg}
                src={surveyInfo.photoURL}
                alt=""
                height="350"
              />
            ) : (
              <></>
            )}
            <div>
              <h3 className={styles.header}>About the study</h3>
              <p>{surveyInfo.description}</p>
              <p>
                <ul className={styles.noBullets}>
                  <li>
                    <span className={styles.eligibilities}>
                      Type of Survey:
                    </span>{" "}
                    {surveyInfo.surveyType}
                  </li>
                  <li>
                    <span className={styles.eligibilities}>
                      Remuneration Type:{" "}
                    </span>
                    {surveyInfo.remunerationType}
                  </li>
                  <li>
                    <span className={styles.eligibilities}>
                      Remuneration Amount:{" "}
                    </span>
                    {surveyInfo.remunerationAmount}
                  </li>
                  <li>
                    <span className={styles.eligibilities}>Closing date: </span>
                    {surveyInfo.closingDate.split("-").reverse().join("/")}
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
                    {surveyInfo.genderEligibility}
                  </li>
                  <li>
                    <span className={styles.eligibilities}>Ethnicity: </span>
                    {surveyInfo.ethnicityEligibility}
                  </li>
                  <li>
                    <span className={styles.eligibilities}>Minimum Age: </span>
                    {surveyInfo.minAge === null ? "Nil" : surveyInfo.minAge}
                  </li>
                  <li>
                    <span className={styles.eligibilities}>Maximum Age: </span>
                    {surveyInfo.maxAge === null ? "Nil" : surveyInfo.maxAge}
                  </li>
                  <li>
                    <span className={styles.eligibilities}>
                      Other Requirements:{" "}
                    </span>
                    {surveyInfo.otherRequirements}
                  </li>
                </ul>
              </p>
            </div>
            <a
              className="btn btn-primary mt-3"
              href={surveyInfo.link}
              target="_blank"
              rel="noreferrer noopener"
              role="button"
            >
              Link to survey
            </a>
          </div>
          <div className="offset-md-1 col-md-4">
            {/* Only have this component if nusnetid don't match */}
            {userId !== surveyInfo.publishedId ? (
              <div className={styles.buttons}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={toggleBookmark}
                >
                  {isBookmarked ? "Remove from Wishlist" : "Add to Wishlist"}
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
              {userId === surveyInfo.publishedId ? (
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
                      {surveyInfo.publisherName}
                    </span>{" "}
                    <br />
                    {surveyInfo.publisherEmail}
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

function useFetchListingInfo(surveyId) {
  const [isValidSurvey, setIsValidSurvey] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photoURL, setPhotoURL] = useState(null);
  const [surveyType, setSurveyType] = useState("");
  const [closingDate, setClosingDate] = useState("");
  const [remunerationType, setRemunerationType] = useState(
    "No remuneration given"
  );
  const [remunerationAmount, setRemunerationAmount] = useState(0);
  const [genderEligibility, setGenderEligibility] = useState("");
  const [ethnicityEligibility, setEthnicityEligibility] = useState("Any");
  const [minAge, setMinAge] = useState(null);
  const [maxAge, setMaxAge] = useState(null);
  const [otherRequirements, setOtherRequirements] = useState("");
  const [surveyLink, setSurveyLink] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [publishedId, setPublisherId] = useState("");
  const [publisherName, setPublisherName] = useState("");
  const [publisherEmail, setPublisherEmail] = useState("");

  const { userInfo, userInfoIsLoading } = useFetchUser();
  const userFetchingId = userInfo?.id;

  const fetchSurveyInfo = async () => {
    const { data: surveys, error } = await supabaseClient
      .from("surveys")
      .select(
        `
        title,
        description,
        category_id(cat_name),
        closing_date,
        remunType: remunerations(category_id(cat_name)),
        remunAmount: remunerations(amount),
        other_eligibility_requirements,
        publisherName: users!surveys_published_by_fkey(full_name),
        publisherEmail: users!surveys_published_by_fkey(email),
        link,
        published_by
      `
      )
      .eq("id", surveyId);

    if (error) {
      console.log(error);
    }

    const survey = surveys[0];
    // console.log(survey);
    if (survey !== undefined) {
      setIsValidSurvey(true);
      setTitle(survey.title);
      setDescription(survey.description);
      setSurveyType(survey.category_id.cat_name);
      setClosingDate(survey.closing_date);
      if (survey.remunType !== null) {
        setRemunerationType(survey.remunType.category_id.cat_name);
      }
      if (survey.remunAmount !== null) {
        setRemunerationAmount(survey.remunAmount.amount);
      }
      if (survey.other_eligibility_requirements) {
        setOtherRequirements(survey.other_eligibility_requirements);
      } else {
        setOtherRequirements("Nil");
      }
      setSurveyLink(survey.link);
      setPublisherName(survey.publisherName.full_name);
      setPublisherEmail(survey.publisherEmail.email);
      setPublisherId(survey.published_by);
    } else {
      setIsValidSurvey(false);
    }
  };

  const fetchGenderEligibility = async () => {
    const { data: gender_eligibilities, error } = await supabaseClient
      .from("gender_eligibilities")
      .select("gender_eligibility_categories(name)")
      .eq("survey_id", surveyId);

    if (error) {
      console.log(error);
    }

    setGenderEligibility(
      gender_eligibilities[0]?.gender_eligibility_categories.name
    );
  };

  const fetchEthnicityEligibility = async () => {
    const { data: ethnicity_eligibility, error } = await supabaseClient
      .from("ethnicity_eligibilities")
      .select("ethnicities(name)")
      .eq("survey_id", surveyId);

    if (error) {
      console.log(error);
    }

    if (ethnicity_eligibility.length !== 0) {
      let strOfEthnicities = ethnicity_eligibility.map(
        (ethnicity, index) => (index ? ", " : "") + ethnicity.ethnicities.name
      );
      setEthnicityEligibility(strOfEthnicities.join(""));
    }
  };

  const fetchAgeEligibility = async () => {
    const { data: age_eligibility, error } = await supabaseClient
      .from("age_eligibilities")
      .select(`min_age, max_age`)
      .eq("survey_id", surveyId);

    if (error) {
      console.log(error);
    }

    if (age_eligibility.length !== 0) {
      setMaxAge(age_eligibility[0].max_age);
      setMinAge(age_eligibility[0].min_age);
    }
  };

  const fetchImgURL = async () => {
    const { data: imgURL, error } = await supabaseClient
      .from("surveys")
      .select("photo")
      .eq("id", surveyId)
      .then((photoLocation) => {
        if (photoLocation.data[0].photo) {
          return supabaseClient.storage
            .from("survey-images")
            .getPublicUrl(photoLocation.data[0].photo);
        } else {
          // set imgURL.publicURL to null
          return { publicURL: null };
        }
      });

    if (error) {
      console.log(error);
    }
    if (imgURL) {
      setPhotoURL(imgURL.publicURL);
    }
  };

  const fetchWishlisted = async () => {
    if (!userInfoIsLoading) {
      const { data: wishlisted_surveys, error } = await supabaseClient
        .from("wishlisted_surveys")
        .select("*")
        .eq("survey_id", surveyId)
        .eq("user_id", userFetchingId);

      if (error) {
        console.log(error);
      }

      if (wishlisted_surveys?.length === 1) {
        setIsWishlisted(true);
      }
    }
  };

  useEffect(() => {
    fetchSurveyInfo();
    fetchGenderEligibility();
    fetchEthnicityEligibility();
    fetchAgeEligibility();
    fetchImgURL();
  }, []);

  useEffect(() => {
    fetchWishlisted();
  }, [userInfo]);

  return {
    isValidSurvey: isValidSurvey,
    title: title,
    description: description,
    photoURL: photoURL,
    surveyType: surveyType,
    closingDate: closingDate,
    remunerationType: remunerationType,
    remunerationAmount: remunerationAmount,
    genderEligibility: genderEligibility,
    ethnicityEligibility: ethnicityEligibility,
    minAge: minAge,
    maxAge: maxAge,
    otherRequirements: otherRequirements,
    surveyLink: surveyLink,
    isWishlisted: isWishlisted,
    publishedId: publishedId,
    publisherName: publisherName,
    publisherEmail: publisherEmail,
  };
}

export default SurveyInfo;
