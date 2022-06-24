import { useForm } from "react-hook-form";
import { supabaseClient } from "../../lib/client";
import { fetchSurveyInfo } from "../SurveyInfo/SurveyInfo";
import { useAuth } from "../../contexts/Auth";
import { useEffect, useState } from "react";
import styles from "./EditSurvey.module.css";
import CreateSurveyForm from "../createSurveyForm/CreateSurveyForm";
import { useNavigate, useLocation } from "react-router-dom";
import NavBarWrapper from "../../helpers/NavBarWrapper";

function EditSurvey() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const { state } = useLocation();

  let surveyId = state.surveyId;
  const navigate = useNavigate();
  let surveyInfo = {};
  const { userInfo } = useAuth();

  const userId = userInfo?.id;

  const [survey, setSurvey] = useState({
    title: surveyInfo.title,
    description: surveyInfo.description,
    link: surveyInfo.link,
    category_id: surveyInfo.category_id,
    remuneration_id: "",
    photo: surveyInfo.photo,
    closing_date: surveyInfo.closing_date,
    other_eligibility_requirements: surveyInfo.other_eligibility_requirements,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(true);
  const [oldFields, setOldFields] = useState({});
  const [updatedFields, setUpdatedFields] = useState({});

  const [ethnicityEligibility, setEthnicityEligibility] = useState({
    chinese: false,
    malay: false,
    indian: false,
    others: false,
  });
  const [genderEligibility, setGenderEligibility] = useState();
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [remunerationType, setRemunerationType] = useState();
  const [remunerationAmount, setRemunerationAmount] = useState();
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const fetchEthnicityEligibility = async () => {
    const { data, error } = await supabaseClient
      .from("ethnicity_eligibilities")
      .select("ethnicities(name)")
      .eq("survey_id", surveyId);
    return data;
  };

  const initEthnicityEligibility = async () => {
    const result = await fetchEthnicityEligibility();
    surveyInfo = { ...surveyInfo, ethnicityEligibility: {} };
    if (result.length !== 4) {
      result.map(async (record) => {
        const { data } = await supabaseClient
          .from("ethnicities")
          .select("id")
          .eq("name", record.ethnicities.name);
        setEthnicityEligibility({
          ...ethnicityEligibility,
          [record.ethnicities.name]: true,
        });
        surveyInfo = {
          ...surveyInfo,
          ethnicityEligibility: {
            ...surveyInfo.ethnicityEligibility,
            [record.ethnicities.name]: true,
          },
        };
      });
    }
  };

  const fetchGenderEligibility = async () => {
    const { data } = await supabaseClient
      .from("gender_eligibilities")
      .select("gender_eligibility_id")
      .eq("survey_id", surveyId);
    return data[0];
  };

  const initGenderEligibility = async () => {
    const result = await fetchGenderEligibility();
    setGenderEligibility(result.gender_eligibility_id);
    surveyInfo = {
      ...surveyInfo,
      ["genderEligibility"]: result.gender_eligibility_id,
    };
  };

  const fetchAgeEligibility = async () => {
    const { data } = await supabaseClient
      .from("age_eligibilities")
      .select("min_age, max_age")
      .eq("survey_id", surveyId);
    return data[0];
  };

  const initAgeEligibility = async () => {
    const result = await fetchAgeEligibility();
    surveyInfo = {
      ...surveyInfo,
      ["minAge"]: result.min_age === 0 ? "" : result.min_age,
    };
    surveyInfo = {
      ...surveyInfo,
      ["maxAge"]: result.max_age === 0 ? "" : result.max_age,
    };
    setMinAge(result.min_age === 0 ? "" : result.min_age);
    setMaxAge(result.max_age === 0 ? "" : result.max_age);
  };

  const fetchRemunerationInfo = async () => {
    const { data, error } = await supabaseClient
      .from("remuneration_categories")
      .select("id")
      .eq("cat_name", surveyInfo.remunType.category_id.cat_name);
    return data[0];
  };

  const initRemunerationInfo = async () => {
    const result = await fetchRemunerationInfo();
    setRemunerationType(result.id);
    setRemunerationAmount(surveyInfo.remunAmount.amount);
    surveyInfo = { ...surveyInfo, ["remuneration_id"]: result.id };
  };

  const fetchSurveyType = async () => {
    const { data, error } = await supabaseClient
      .from("surveys")
      .select("category_id")
      .eq("id", surveyId);
    return data[0];
  };

  const initSurveyType = async () => {
    const result = await fetchSurveyType();
    surveyInfo = { ...surveyInfo, ["category_id"]: result.category_id };
  };

  const fetchImageInfo = async () => {
    if (surveyInfo.photo !== "") {
      setPreviewUrl(surveyInfo.photo);
    }
  };

  const cleanUpdatedFields = async () => {
    //TODO: update survey listing logic
    let tempState = { ...updatedFields };
    console.log(oldFields);
    console.log(updatedFields);
    Object.keys(updatedFields).forEach(async (key) => {
      if (key === "remuneration_id") {
        //dont do anything, since you need to know remunerationAmt
        return;
      }
      if (key === "remunerationAmount") {
        if (
          "remuneration_id" in updatedFields &&
          updatedFields["remuneration_id"] == 3
        ) {
          delete tempState[key]; //we dont need remunAmt anymore
        }
        return;
      }
      if (key in oldFields && updatedFields[key] == oldFields[key]) {
        delete tempState[key];
      } else if (!(key in oldFields)) {
        //key is an ethnicity
        if (Object.keys(oldFields.ethnicityEligibility).length === 0) {
          const { data, error } = await supabaseClient
            .from("ethnicity_eligibilities")
            .delete()
            .match({ survey_id: surveyId });
        } else {
          //checkbox for ethnicity was originally checked
          let capitalisedKey = key.charAt(0).toUpperCase() + key.slice(1);
          if (capitalisedKey in oldFields.ethnicityEligibility) {
            if (
              updatedFields[key] ==
              oldFields.ethnicityEligibility[capitalisedKey]
            ) {
              delete tempState[key];
            }
          } else {
            //checkbox was not originally checked
            if (!updatedFields[key]) {
              delete tempState[key];
            }
          }
        }
      }
      console.log(tempState);
      setUpdatedFields(tempState);
      //setIsUpdating(false);
    });
    setIsUpdating(false);
  };

  const onFormSubmit = async (e) => {
    //e.preventDefault();
    await cleanUpdatedFields();
    //navigate("/mysurveys");
  };

  //updates last_updated field and perform sanity check for ethnicity eligibilities
  //executed after iterating through all fields in updatedFields
  const cleanUpAfterUpdate = async () => {
    //sanity check: if there are no more records for the survey in ethnicity_eligibilities, add all 4 rows
    const { count, error } = await supabaseClient
      .from("ethnicity_eligibilities")
      .select("survey_id", { count: "exact", head: true })
      .eq("survey_id", surveyId);

    console.log(count);
    if (count === 0) {
      console.log("Insert everything");
      const { data } = await supabaseClient
        .from("ethnicity_eligibilities")
        .insert([
          { survey_id: surveyId, ethnicity_id: 1 },
          { survey_id: surveyId, ethnicity_id: 2 },
          { survey_id: surveyId, ethnicity_id: 3 },
          { survey_id: surveyId, ethnicity_id: 4 },
        ]);
    }

    // update last_updated
    let todaysDate = new Date().toISOString().split("T")[0];
    const { data } = await supabaseClient
      .from("surveys")
      .update({ last_updated: todaysDate })
      .eq("id", surveyId);
  };

  const updateDatabaseRecords = async () => {
    console.log(updatedFields);
    let counter = Object.keys(updatedFields).length;

    //update title, desc, link, cat_id in surveys first
    Object.keys(updatedFields).forEach(async (key) => {
      if (
        key === "title" ||
        key === "description" ||
        key === "link" ||
        key === "category_id" ||
        key === "closing_date" ||
        key === "other_eligibility_requirements"
      ) {
        const { data, error } = await supabaseClient
          .from("surveys")
          .update({ [key]: updatedFields[key] })
          .match({ id: surveyId });
        if (error) {
          console.log(error);
        } else {
          console.log(`Updated ${key} successfully`);
        }
      }
      //update remuneration info
      if (key === "remuneration_id") {
        if (updatedFields[key] == "3") {
          const { data } = await supabaseClient
            .from("surveys")
            .update({
              remuneration_id: 1,
            })
            .match({ id: surveyId });
        } else {
          if ("remunerationAmount" in updatedFields) {
            return;
          } else {
            console.log("reached")
            let currAmt = oldFields.remunAmount.amount;
            console.log(currAmt);
            const { data: record } = await supabaseClient
              .from("remunerations")
              .select()
              .match({ category_id: updatedFields[key], amount: currAmt });
            console.log(record);
            if (record.length === 0) {
              //no existing record found. insert
              const { count } = await supabaseClient
                .from("remunerations")
                .select("id", { count: "exact", head: true });
              const { error } = await supabaseClient
                .from("remunerations")
                .insert({
                  id: count + 1,
                  category_id: updatedFields[key],
                  amount: currAmt,
                });
              const { data } = await supabaseClient
                .from("surveys")
                .update({ remuneration_id: count + 1 })
                .match({ id: surveyId });
            } else {
              //remuneration record exists. update remuneration_id
              const { data } = await supabaseClient
                .from("surveys")
                .update({ remuneration_id: record[0].id })
                .match({ id: surveyId });
            }
          }
        }
      }

      if (key === "remunerationAmount") {
        if ("remuneration_id" in updatedFields) {
          const { data: record } = await supabaseClient
            .from("remunerations")
            .select()
            .match({
              category_id: updatedFields["remuneration_id"],
              amount: updatedFields[key],
            });

          if (record.length === 0) {
            //no existing record found. insert
            const { count } = await supabaseClient
              .from("remunerations")
              .select("id", { count: "exact", head: true });
            const { error } = await supabaseClient
              .from("remunerations")
              .insert({
                id: count + 1,
                category_id: updatedFields["remuneration_id"],
                amount: updatedFields[key],
              });
            const { data } = await supabaseClient
              .from("surveys")
              .update({ remuneration_id: count + 1 })
              .match({ id: surveyId });
          } else {
            //remuneration record exists. update remuneration_id
            const { data } = await supabaseClient
              .from("surveys")
              .update({ remuneration_id: record[0].id })
              .match({ id: surveyId });
          }
        } else {
          const { data: record } = await supabaseClient
            .from("remunerations")
            .select()
            .match({
              category_id: oldFields["remuneration_id"],
              amount: updatedFields[key],
            });

          if (record.length === 0) {
            //no existing record found. insert
            const { count } = await supabaseClient
              .from("remunerations")
              .select("id", { count: "exact", head: true });
            const { error } = await supabaseClient
              .from("remunerations")
              .insert({
                id: count + 1,
                category_id: oldFields["remuneration_id"],
                amount: updatedFields[key],
              });
            const { data } = await supabaseClient
              .from("surveys")
              .update({ remuneration_id: count + 1 })
              .match({ id: surveyId });
          } else {
            //remuneration record exists. update remuneration_id
            const { data } = await supabaseClient
              .from("surveys")
              .update({ remuneration_id: record[0].id })
              .match({ id: surveyId });
          }
        }
      }

      //update gender eligibility
      if (key === "genderEligibility") {
        const { data, error } = await supabaseClient
          .from("gender_eligibilities")
          .update({
            gender_eligibility_id: updatedFields[key],
          })
          .match({ survey_id: surveyId });

        if (!error) {
          console.log("Updated gender eligibility successfully");
        }
      }

      //update age eligibility
      if (key === "minAge" || key === "maxAge") {
        const { data, error } = await supabaseClient
          .from("age_eligibilities")
          .update({
            [key === "minAge" ? "min_age" : "max_age"]: updatedFields[key],
          })
          .match({ survey_id: surveyId });

        if (!error) {
          console.log("Updated age eligibility successfully");
        }
      }

      //update ethnicity eligibility
      if (
        key == "chinese" ||
        key === "malay" ||
        key === "indian" ||
        key === "others"
      ) {
        const { data: ethnicity } = await supabaseClient
          .from("ethnicities")
          .select()
          .ilike("name", key);
        console.log(updatedFields);
        console.log(ethnicity);
        console.log(key);
        if (updatedFields[key]) {
          console.log("Inserting ethnicity eligibility...");
          const { data, error } = await supabaseClient
            .from("ethnicity_eligibilities")
            .insert([
              {
                survey_id: surveyId,
                ethnicity_id: ethnicity[0].id,
              },
            ]);
          if (error) {
            console.log(error);
          } else {
            console.log(data);
          }
        } else {
          const { data, error } = await supabaseClient
            .from("ethnicity_eligibilities")
            .delete()
            .match({ survey_id: surveyId, ethnicity_id: ethnicity[0].id });
        }
        console.log("Updated ethnicity eligibility requirements");
      }

      counter--;
      if (counter === 0) {
        await cleanUpAfterUpdate();
      }
    });

    setUpdatedFields({});
    //update last_updated field
    //console.log(updatedFields);
  };

  useEffect(() => {
    if (!isUpdating) {
      updateDatabaseRecords().then(navigate("/surveys/" + surveyId));
    }
  }, [isUpdating]);

  const handleInputChange = (e, edit) => {
    const { name, value } = e.target;
    setSurvey({ ...survey, [name]: value });
    if (edit) {
      setUpdatedFields({ ...updatedFields, [name]: value });
    }
  };

  const handleGenderInputChange = (e, edit) => {
    const { value } = e.target;
    setGenderEligibility(value);
    if (edit) {
      setUpdatedFields({ ...updatedFields, ["genderEligibility"]: value });
    }
  };

  const handleMinAgeInputChange = (e, edit) => {
    const { value } = e.target;
    setMinAge(value);
    if (edit) {
      setUpdatedFields({ ...updatedFields, ["minAge"]: value });
    }
  };

  const handleMaxAgeInputChange = (e, edit) => {
    const { value } = e.target;
    setMaxAge(value);
    if (edit) {
      setUpdatedFields({ ...updatedFields, ["maxAge"]: value });
    }
  };

  const handleAmountInputChange = (e, edit) => {
    const { value } = e.target;
    setRemunerationAmount(value);
    if (edit) {
      setUpdatedFields({ ...updatedFields, ["remunerationAmount"]: value });
    }
  };

  const handleCheckboxChange = (e, edit) => {
    const { name, checked } = e.target;
    setEthnicityEligibility({ ...ethnicityEligibility, [name]: checked });
    if (edit) {
      setUpdatedFields({ ...updatedFields, [name]: checked });
    }
  };

  const handleSideEffects = async () => {
    surveyInfo = await fetchSurveyInfo(surveyId);
    await initEthnicityEligibility();
    await initAgeEligibility();
    await initGenderEligibility();
    await initRemunerationInfo();
    await initSurveyType();
    await fetchImageInfo();
  };

  useEffect(() => {
    handleSideEffects().then(() => {
      let defaultValues = {
        title: surveyInfo.title,
        description: surveyInfo.description,
        link: surveyInfo.link,
        category_id: surveyInfo.category_id,
        photo: surveyInfo.photo,
        remuneration_id: surveyInfo.remuneration_id,
        remunerationAmount:
          surveyInfo.remunAmount.amount === 0
            ? ""
            : surveyInfo.remunAmount.amount,
        closing_date: surveyInfo.closing_date,
        other_eligibility_requirements:
          surveyInfo.other_eligibility_requirements,
        minAge: surveyInfo.minAge,
        maxAge: surveyInfo.maxAge,
        genderEligibility: surveyInfo.genderEligibility,
        chinese: "Chinese" in surveyInfo.ethnicityEligibility,
        malay: "Malay" in surveyInfo.ethnicityEligibility,
        indian: "Indian" in surveyInfo.ethnicityEligibility,
        others: "Others" in surveyInfo.ethnicityEligibility,
      };
      reset({ ...defaultValues });
      setOldFields(surveyInfo);
      setIsLoading(false);
    });
  }, []);

  return (
    <div id={styles.editSurveyWindow}>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h1 id={styles.editSurveyHeader}>Edit Survey</h1>
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
            edit={true}
            source={updatedFields}
            setUpdatedFields={setUpdatedFields}
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
                id={styles.updateBtn}
                disabled={Object.keys(updatedFields).length === 0}
                onClick={handleSubmit(onFormSubmit)}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NavBarWrapper(EditSurvey);
