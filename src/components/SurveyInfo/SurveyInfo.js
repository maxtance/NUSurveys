import styles from "./SurveyInfo.module.css";
import Navbar from "../navbar/Navbar";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabaseClient } from "../../lib/client";
import useBookmark from "../../helpers/useBookmark";
import { useAuth } from "../../contexts/Auth";
import { isSurveyClosed } from "../../helpers/helperFunctions";

import closeListingImg from "../../assets/close_listing_img.png";
import editListingImg from "../../assets/edit_listing_img.png";
import deleteListingImg from "../../assets/delete_listing_img.png";
import openListingImg from "../../assets/open_listing_img.png";
import emailImg from "../../assets/email_img.png";

// Things left to implement:
// 1. For surveyor
//     a. Mark survey as complete

function SurveyInfo() {
  let { surveyId } = useParams();
  let navigate = useNavigate();
  const { userInfo } = useAuth();
  const userId = userInfo.id;

  const surveyInfo = useFetchListingInfo(surveyId);
  const [isBookmarked, setAndUpdateIsBookmarked] = useBookmark(
    surveyInfo.isWishlisted,
    surveyId
  );

  function toggleBookmark() {
    setAndUpdateIsBookmarked();
  }

  const [isClosed, setIsClosed] = useState(
    isSurveyClosed(surveyInfo.closingDate)
  );
  const [closingDate, setClosingDate] = useState(surveyInfo.closingDate);

  useEffect(() => {
    setIsClosed(isSurveyClosed(surveyInfo.closingDate));
    setClosingDate(surveyInfo.closingDate);
  }, [surveyInfo.closingDate]);

  function handleEditListing() {
    navigate("/mysurveys/edit-survey/", { state: { surveyId: surveyId } });
  }

  function handleCloseListing() {
    // Update closing_date of survey to 2000-01-01
    const newClosingDate = "2000-01-01";
    const updateClosingDate = async () => {
      console.log("Update closing data");
      const { data, error } = await supabaseClient
        .from("surveys")
        .update({ closing_date: newClosingDate })
        .eq("id", surveyId);
    };
    updateClosingDate();
    setClosingDate(newClosingDate);
    // Rerender my listing component
    setIsClosed(true);
  }

  function handleDeleteListing() {
    // update database is_closed = true
    const updateIsDeleted = async () => {
      console.log("Deleting survey");
      const { data, error } = await supabaseClient
        .from("surveys")
        .update({ is_deleted: true })
        .eq("id", surveyId);
    };
    updateIsDeleted();
    // redirect to mysurveys
    navigate("/mysurveys");
  }

  function handleOpenListing() {
    // get user to input newClosingDate
    const newClosingDate = document.getElementById("newClosingDate").value;
    // update database closing_date to newClosingDate
    const updateClosingDate = async () => {
      console.log("Update closing data");
      const { data, error } = await supabaseClient
        .from("surveys")
        .update({ closing_date: newClosingDate })
        .eq("id", surveyId);
    };
    updateClosingDate();
    setClosingDate(newClosingDate);
    // Rerender my listing component
    setIsClosed(false);
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
        <div className={`offset-md-1 row col-md-6 ${styles.title}`}>
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
              <h3 className={styles.aboutHeader}>About the study</h3>
              {/* <p className={styles.descriptionHeader}>Description: </p> */}
              <p className={styles.description}>{surveyInfo.description}</p>
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
                  {surveyInfo.remunerationType === "No remuneration given" ? (
                    <></>
                  ) : (
                    <li>
                      <span className={styles.eligibilities}>
                        Remuneration Amount:{" "}
                      </span>
                      ${surveyInfo.remunerationAmount}
                    </li>
                  )}
                  <li>
                    <span className={styles.eligibilities}>Closing date: </span>
                    {closingDate === "2000-01-01"
                      ? "-"
                      : closingDate.split("-").reverse().join("/")}
                  </li>
                </ul>
              </p>
            </div>
            <div>
              <h3 className={styles.eligibilityHeader}>Eligibility</h3>
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
                    {surveyInfo.otherRequirements === "Nil" ? (
                      "Nil"
                    ) : (
                      <p className={styles.otherRequirements}>
                        {surveyInfo.otherRequirements}
                      </p>
                    )}
                  </li>
                </ul>
              </p>
            </div>
            {isClosed ? (
              <button className={styles.linkButton} disabled>
                Survey is closed
              </button>
            ) : (
              <form action={surveyInfo.surveyLink} target="_blank">
                <button className={styles.linkButton} type="submit">
                  Link to survey
                </button>{" "}
              </form>
            )}
          </div>
          <div className="offset-md-1 col-md-4">
            {/* Only have this component if nusnetid don't match */}
            {userId !== surveyInfo.publishedId ? (
              <div>
                <button
                  type="button"
                  className={styles.wishlistButton}
                  onClick={toggleBookmark}
                >
                  {isBookmarked ? "Remove from Wishlist" : "Add to Wishlist"}
                </button>
                {isSurveyClosed(surveyInfo.closingDate) ? (
                  <button
                    type="button"
                    className={styles.completedButton}
                    disabled
                  >
                    Mark as Completed
                  </button>
                ) : (
                  <button type="button" className={styles.completedButton}>
                    Mark as Completed
                  </button>
                )}
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
                        {" "}
                        {isClosed ? (
                          <li className={styles.editListingDisabled}>
                            <img
                              className={styles.icons}
                              src={editListingImg}
                              alt=""
                            />{" "}
                            Edit listing
                          </li>
                        ) : (
                          <li
                            className={styles.cursorPointer}
                            onClick={handleEditListing}
                          >
                            <img
                              className={styles.icons}
                              src={editListingImg}
                              alt=""
                            />{" "}
                            Edit listing
                          </li>
                        )}
                        {isClosed ? (
                          <PopUp
                            value="Open"
                            handleOnClick={handleOpenListing}
                          />
                        ) : (
                          <PopUp
                            value="Close"
                            handleOnClick={handleCloseListing}
                          />
                        )}
                        <PopUp
                          value="Delete"
                          handleOnClick={handleDeleteListing}
                        />
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
                    <p className={styles.contactName}>
                      {surveyInfo.publisherName}
                    </p>
                    <img className={styles.icons} src={emailImg} alt="" />
                    {" " + surveyInfo.publisherEmail}
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

function PopUp(props) {
  const target = props.value + "Modal";
  const [newDate, setNewDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  return (
    <>
      <li
        className={styles.cursorPointer}
        data-bs-toggle="modal"
        data-bs-target={`#${target}`}
      >
        {props.value === "Close" ? (
          <span>
            <img className={styles.icons} src={closeListingImg} alt="" /> Mark
            listing as closed
          </span>
        ) : props.value === "Open" ? (
          <span>
            <img className={styles.icons} src={openListingImg} alt="" /> Reopen
            listing
          </span>
        ) : (
          <span>
            <img className={styles.icons} src={deleteListingImg} alt="" />{" "}
            Delete listing
          </span>
        )}
      </li>

      <div
        className="modal fade"
        id={target}
        aria-labelledby={`${target}Label`}
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id={`${target}Label`}>
                {props.value === "Close"
                  ? "Mark your listing as Closed?"
                  : props.value === "Open"
                  ? "Reopen your survey listing?"
                  : "Delete this listing?"}
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              {props.value === "Close" ? (
                "Users can no longer access the survey link."
              ) : props.value === "Open" ? (
                <>
                  Set new closing date:
                  <input
                    className={styles.closeCalendar}
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    id="newClosingDate"
                  />
                </>
              ) : (
                "You cannot undo this action."
              )}
            </div>
            <div className={styles.buttonsContainer}>
              <button
                type="button"
                className={styles.cancelButton}
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              {props.value === "Close" ? (
                <button
                  type="button"
                  className={styles.confirmButton}
                  data-bs-dismiss="modal"
                  onClick={props.handleOnClick}
                >
                  Close listing
                </button>
              ) : props.value === "Open" ? (
                <button
                  type="button"
                  className={styles.confirmButton}
                  data-bs-dismiss="modal"
                  onClick={props.handleOnClick}
                >
                  Reopen
                </button>
              ) : (
                <button
                  type="button"
                  className={styles.confirmButton}
                  data-bs-dismiss="modal"
                  onClick={props.handleOnClick}
                >
                  Yes, delete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const fetchSurveyInfo = async (surveyId) => {
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
  return survey;
};

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

  const { userInfo } = useAuth();
  const userFetchingId = userInfo?.id;

  const initialiseVariables = async () => {
    const survey = await fetchSurveyInfo(surveyId);
    if (survey !== undefined) {
      setIsValidSurvey(true);
      setTitle(survey.title);
      setDescription(survey.description);
      setSurveyType(survey.category_id.cat_name);
      setClosingDate(survey.closing_date);
      if (survey.remunType.category_id.cat_name !== "NA") {
        setRemunerationType(survey.remunType.category_id.cat_name);
      }
      setRemunerationAmount(survey.remunAmount.amount);
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

    if (ethnicity_eligibility.length !== 4) {
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

    // if age == 0 --> set to null
    setMaxAge(
      age_eligibility[0].max_age === 0 ? null : age_eligibility[0].max_age
    );
    setMinAge(
      age_eligibility[0].min_age === 0 ? null : age_eligibility[0].min_age
    );
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
  };

  useEffect(() => {
    initialiseVariables();
    fetchGenderEligibility();
    fetchEthnicityEligibility();
    fetchAgeEligibility();
    fetchImgURL();
    fetchWishlisted();
  }, []);

  // useEffect(() => {
  //   fetchWishlisted();
  // }, [userInfo]);

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
