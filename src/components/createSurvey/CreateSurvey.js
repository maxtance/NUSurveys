import { useState } from "react";
import CreateSurveyForm from "../createSurveyForm/CreateSurveyForm";
import NavBarWrapper from "../../helpers/NavBarWrapper";
import styles from "./CreateSurvey.module.css";
import { useNavigate } from "react-router-dom";
import { supabaseClient } from "../../lib/client";

function CreateSurvey() {
  const getDate = (months) => {
    const date = new Date();
    const closingDate = new Date(date.setMonth(date.getMonth() + months));
    const closingDateMonth =
      closingDate.getMonth() + 1 < 10
        ? "0" + (closingDate.getMonth() + 1)
        : closingDate.getMonth() + 1;
    const closingDateDay =
      closingDate.getDate() < 10
        ? "0" + closingDate.getDate()
        : closingDate.getDate();
    return (
      closingDate.getFullYear() + "-" + closingDateMonth + "-" + closingDateDay
    );
  };

  const [ethnicityEligibility, setEthnicityEligibility] = useState({
    Chinese: false,
    Malay: false,
    Indian: false,
    Others: false,
  });

  const [genderEligibility, setGenderEligibility] = useState(3);

  const [minAge, setMinAge] = useState();

  const [maxAge, setMaxAge] = useState();

  const [remunerationAmount, setRemunerationAmount] = useState();

  const [survey, setSurvey] = useState({
    title: "",
    description: "",
    link: "",
    category_id: 1,
    remuneration_id: null,
    photo: "",
    closing_date: getDate(1),
    other_eligibility_requirements: "",
    date_published: getDate(0),
    last_updated: getDate(0),
    published_by: "E0789289", //dummy user nusnet id
  });

  const addSurveyListing = async () => {
    //upsert into remunerations
    //get id for new remuneration record
    const { error, count } = await supabaseClient
      .from("remunerations")
      .select("id", { count: "exact", head: true });

    if (error) {
      console.log(error);
    } else {
      //insert into remunerations
      console.log(survey.remuneration_id);
      if (survey.remuneration_id !== "") {
        const { error } = await supabaseClient
          .from("remunerations")
          .upsert({
            id: count,
            category_id: survey.category_id,
            amount: survey.amount,
          });
        if (error) {
          console.log(error);
        }
      } else {
        //insert into surveys
        console.log(JSON.stringify(survey));
        const { count: surveyCount } = await supabaseClient
          .from("surveys")
          .select("id", { count: "exact", head: true });
        const { data: surveyRecord, error } = await supabaseClient
          .from("surveys")
          .insert([{ ...survey, id: surveyCount }]);
        if (error) {
          console.log(error);
        } else {
          //insert into gender_eligibilities
          const { error } = await supabaseClient
            .from("gender_eligibilities")
            .insert([
              {
                survey_id: surveyRecord.id,
                gender_eligibility_id: genderEligibility,
              },
            ]);
          if (error) {
            console.log(error);
          } else {
            //insert into age_eligibilities
            const { error } = await supabaseClient
              .from("age_eligibilities")
              .insert([
                {
                  survey_id: surveyRecord.id,
                  min_age: minAge,
                  max_age: maxAge,
                },
              ]);
            if (error) {
              console.log(error);
            } else {
              //insert into ethnicity_eligibilities
              for (var key in ethnicityEligibility) {
                if (ethnicityEligibility[key]) {
                  const { data: ethnicity } = await supabaseClient
                    .from("ethnicities")
                    .select()
                    .eq("name", key);
                  const { data, error } = await supabaseClient
                    .from("ethnicity_eligibilities")
                    .insert([
                      {
                        survey_id: surveyRecord.id,
                        ethnicity_id: ethnicity.id,
                      },
                    ]);
                  if (error) {
                    console.log(error);
                  }
                }
              }
            }
          }
        }
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addSurveyListing();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSurvey({ ...survey, [name]: value });
  };

  const handleGenderInputChange = (e) => {
    const { value } = e.target;
    setGenderEligibility(value);
  };

  const handleMinAgeInputChange = (e) => {
    const { value } = e.target;
    setMinAge(value);
  };

  const handleMaxAgeInputChange = (e) => {
    const { value } = e.target;
    setMaxAge(value);
  };

  const handleAmountInputChange = (e) => {
    const { value } = e.target;
    setRemunerationAmount(value);
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    console.log(name, checked);
    setEthnicityEligibility({ ...ethnicityEligibility, [name]: checked });
  };

  const navigate = useNavigate();

  return (
    <div id={styles.createSurveyWindow}>
      <h1 id={styles.createSurveyHeader}>Create New Survey</h1>
      <CreateSurveyForm
        survey={survey}
        genderEligibility={genderEligibility}
        ethnicityEligibility={ethnicityEligibility}
        minAge={minAge}
        maxAge={maxAge}
        remunerationAmount={remunerationAmount}
        handleInputChange={handleInputChange}
        handleCheckboxChange={handleCheckboxChange}
        handleGenderInputChange={handleGenderInputChange}
        handleMinAgeInputChange={handleMinAgeInputChange}
        handleMaxAgeInputChange={handleMaxAgeInputChange}
        handleAmountInputChange={handleAmountInputChange}
        handleSubmit={handleSubmit}
      />
      <div class="row" id={styles.btnContainer}>
        <div class="col-md-1 offset-md-10">
          <button
            class="btn"
            id={styles.resetBtn}
            type="reset"
            onClick={() => {
              navigate("/mysurveys");
            }}
          >
            Cancel
          </button>
        </div>
        <div class="col-md-1">
          <button class="btn" id={styles.submitBtn} onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default NavBarWrapper(CreateSurvey);
