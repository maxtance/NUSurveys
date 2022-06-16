import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { supabaseClient } from "../../lib/client";
import CreateSurveyForm from "../createSurveyForm/CreateSurveyForm";
import NavBarWrapper from "../../helpers/NavBarWrapper";
import styles from "./CreateSurvey.module.css";

export function getDate(months) {
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
}

function CreateSurvey() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [ethnicityEligibility, setEthnicityEligibility] = useState({
    chinese: false,
    malay: false,
    indian: false,
    others: false,
  });

  const [genderEligibility, setGenderEligibility] = useState("");

  const [minAge, setMinAge] = useState("");

  const [maxAge, setMaxAge] = useState("");

  const [remunerationAmount, setRemunerationAmount] = useState();

  const [image, setImage] = useState();
  const [previewUrl, setPreviewUrl] = useState("");

  const [survey, setSurvey] = useState({
    title: "",
    description: "",
    link: "",
    category_id: "",
    remuneration_id: "",
    photo: "",
    closing_date: getDate(1),
    other_eligibility_requirements: "",
    date_published: getDate(0),
    last_updated: getDate(0),
    published_by: 1, //dummy user nusnet id
  });

  const handleFile = async (file) => {
    console.log(file);

    const { data, error } = await supabaseClient.storage
      .from('survey-images')
      .upload(`public/E0789289/${previewUrl}`, file);

    if (error) {
      console.log(error);
    } else {
      console.log(data);
    }
  }

  const addSurveyListing = async () => {   
    if (image !== null) {
      await handleFile(image);
      survey.photo = `public/E0789289/${previewUrl}`;
    } 

    //get id for new remuneration record
    const { error, count } = await supabaseClient
      .from("remunerations")
      .select("id", { count: "exact", head: true });
    if (error) {
      console.log(error);
    } else {
      //insert into remunerations
      console.log(survey.remuneration_id);
      if (survey.remuneration_id !== "3") {
        const { data: remunerationRecord, error } = await supabaseClient
          .from("remunerations")
          .select()
          .eq("category_id", survey.remuneration_id)
          .eq("amount", remunerationAmount);
        if (error) {
          console.log(error);
        } else {
          console.log(remunerationRecord)
          if (remunerationRecord.length === 0) {
            const { error } = await supabaseClient
              .from("remunerations")
              .insert({
                id: count + 1,
                category_id: survey.remuneration_id,
                amount: remunerationAmount,
              });
            survey.remuneration_id = count + 1;
          }
          if (error) {
            console.log(error);
          }
        }
      } else {
        survey.remuneration_id = null;
      }
      //insert into surveys
      const { count: surveyCount } = await supabaseClient
        .from("surveys")
        .select("id", { count: "exact", head: true });
      const { data: surveyRecord, error } = await supabaseClient
        .from("surveys")
        .insert([{ ...survey, id: surveyCount + 1 }]);
      if (error) {
        console.log(error);
      } else {
        const { error, count: genderEligibilityCount } = await supabaseClient
          .from("gender_eligibilities")
          .select("id", { count: "exact", head: true });
        if (error) {
          console.log(error);
        } else {
          //insert into gender eligibilities
          const { error } = await supabaseClient
            .from("gender_eligibilities")
            .insert([
              {
                id: genderEligibilityCount + 1,
                survey_id: surveyRecord[0]["id"],
                gender_eligibility_id: genderEligibility,
              },
            ]);
          if (error) {
            console.log(error);
          } else {
            if (minAge !== "" || maxAge !== "") {
              //insert into age_eligibilities
              const { error, count: ageEligibilityCount } = await supabaseClient
                .from("age_eligibilities")
                .select("id", { count: "exact", head: true });
              if (error) {
                console.log(error);
              } else {
                const { error } = await supabaseClient
                  .from("age_eligibilities")
                  .insert([
                    {
                      id: ageEligibilityCount + 1,
                      survey_id: surveyRecord[0]["id"],
                      min_age: minAge === "" ? null : minAge,
                      max_age: maxAge === "" ? null : maxAge,
                    },
                  ]);
                if (error) {
                  console.log(error);
                }
              }
            }
            //insert into ethnicity_eligibilities
            for (var key in ethnicityEligibility) {
              if (ethnicityEligibility[key]) {
                const { error, count: ethnicityEligibilityCount } =
                  await supabaseClient
                    .from("ethnicity_eligibilities")
                    .select("id", { count: "exact", head: true });
                if (error) {
                  console.log(error);
                } else {
                  console.log(key);
                  const { data: ethnicity } = await supabaseClient
                    .from("ethnicities")
                    .select()
                    .ilike("name", key);
                  console.log(ethnicity);
                  const { data, error } = await supabaseClient
                    .from("ethnicity_eligibilities")
                    .insert([
                      {
                        id: ethnicityEligibilityCount + 1,
                        survey_id: surveyRecord[0]["id"],
                        ethnicity_id: ethnicity[0]["id"],
                      },
                    ]);
                  if (error) {
                    console.log(error);
                  }
                }
              }
            }
            /*
            const { data, error } = await supabaseClient.storage
              .from('survey-images')
              .download(`public/E0789289/${previewUrl}`);
            if (error) {
              console.log(error);
            } else {
              console.log(data);
            }
            */
          }
        }
      }
    }
  };

  const onFormSubmit = async (e) => {
    //e.preventDefault();
    await addSurveyListing();
    navigate("/mysurveys");
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
        image={image}
        setImage={setImage}
        previewUrl={previewUrl}
        setPreviewUrl={setPreviewUrl}
        handleInputChange={handleInputChange}
        handleCheckboxChange={handleCheckboxChange}
        handleGenderInputChange={handleGenderInputChange}
        handleMinAgeInputChange={handleMinAgeInputChange}
        handleMaxAgeInputChange={handleMaxAgeInputChange}
        handleAmountInputChange={handleAmountInputChange}
        register={register}
        errors={errors}
        watch={watch}
      />
      <div class="row" id={styles.btnContainer}>
        <div class="col-lg-1 offset-lg-10 col-md-1 offset-md-9">
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
        <div class="col-lg-1 col-md-2">
          <button
            class="btn"
            id={styles.submitBtn}
            onClick={handleSubmit(onFormSubmit)}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default NavBarWrapper(CreateSurvey);
