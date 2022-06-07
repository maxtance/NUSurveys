import styles from "./CreateSurveyForm.module.css";

function CreateSurveyForm({
  survey,
  genderEligibility,
  ethnicityEligibility,
  minAge,
  maxAge,
  remunerationAmount,
  handleInputChange,
  handleCheckboxChange,
  handleGenderInputChange,
  handleMinAgeInputChange,
  handleMaxAgeInputChange,
  handleAmountInputChange,
  register,
  errors,
  watch,
}) {
  const URL_REGEX =
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;

  const warningIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      fill="currentColor"
      class="bi bi-exclamation-triangle-fill"
      id={styles.warningIcon}
      viewBox="0 0 16 16"
    >
      <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
    </svg>
  );
  /*
  const onFormSubmit = () => {
    console.log(errors);
  }
  */

  const renderErrorMsg = (component) => {
    console.log(errors);
    return (
      <div class={styles.validation}>
        {warningIcon}
        <p class={styles.errorMsg}>{errors[component].message}</p>
      </div>
    );
  };

  const requiredField = () =>
    (watch("remuneration_id") === "3") | (watch("remuneration_id") === "")
      ? false
      : "Please enter a remuneration amount";

  return (
    <form class="form-horizontal" id={styles.surveyForm}>
      <section>
        <h2 class={styles.sectionHeader}>Basic Information</h2>
        <div class="row">
          <div class="col-md-6">
            <div class={`form-group ${styles.formGroup}`}>
              <label for="title" class={styles.requiredField}>
                Title
              </label>
              <input
                type="text"
                name="title"
                {...register("title", {
                  required: "Please enter a title for your survey",
                  maxLength: {
                    value: 250,
                    message: "Exceeded character limit of 250",
                  },
                })}
                value={survey.title}
                onChange={(e) => {
                  register("title").onChange(e);
                  handleInputChange(e);
                }}
                class="form-control"
                id={styles.title}
                placeholder="No longer than 250 characters."
              />
              {errors?.title ? renderErrorMsg("title") : null}
            </div>

            <div class={`form-group ${styles.formGroup}`}>
              <label for="description">Short Description</label>
              <textarea
                type="text"
                name="description"
                {...register("description", {
                  maxLength: {
                    value: 1000,
                    message: "Exceeded character limit of 1000",
                  },
                })}
                value={survey.description}
                onChange={(e) => {
                  register("description").onChange(e);
                  handleInputChange(e);
                }}
                class="form-control"
                id={styles.description}
                placeholder="Enter a short description to let people know what your survey is about."
              />
            </div>

            <div class={`form-group ${styles.formGroup}`}>
              <label for="link" class={styles.requiredField}>
                Link
              </label>
              <input
                type="url"
                name="link"
                {...register("link", {
                  required: "Please enter a link for your survey",
                  pattern: {
                    value: URL_REGEX,
                    message: "Invalid URL",
                  },
                })}
                value={survey.link}
                onChange={(e) => {
                  register("link").onChange(e);
                  handleInputChange(e);
                }}
                class="form-control"
                id={styles.link}
                placeholder="Paste your URL here!"
              />
              {errors?.link ? renderErrorMsg("link") : null}
            </div>
          </div>

          <div class="col-md-5 offset-md-1">
            <label for="photo">Photo</label>
            <br />
            <small class="form-text text-muted">
              You may choose to upload a picture to go with your listing. This
              is not compulsory.
            </small>
          </div>
        </div>

        <div class="row">
          <div class="col-md-5">
            <div class={`form-group ${styles.formGroup}`}>
              <label for="category_id" class={styles.requiredField}>
                Type of Survey
              </label>
              <select
                required
                class="form-select"
                name="category_id"
                {...register("category_id", {
                  required: "Please select a survey type",
                })}
                value={survey.category_id}
                onChange={(e) => {
                  register("category_id").onChange(e);
                  handleInputChange(e);
                }}
                id={styles.surveyType}
              >
                <option selected value="">
                  Select the option that best fits your survey
                </option>
                <option value="1">Online survey</option>
                <option value="2">Research study (remote)</option>
                <option value="3">Research study (on-site)</option>
              </select>
              {errors?.category_id ? renderErrorMsg("category_id") : null}
            </div>

            <div class={`form-group ${styles.formGroup}`}>
              <label for="remuneration_id" class={styles.requiredField}>
                Remuneration Type
              </label>
              <select
                required
                class="form-select"
                name="remuneration_id"
                {...register("remuneration_id", {
                  required: "Please select a remuneration type",
                })}
                value={survey.remuneration_id}
                onChange={(e) => {
                  register("remuneration_id").onChange(e);
                  handleInputChange(e);
                }}
                id={styles.remunerationType}
              >
                <option selected value="">
                  How are you compensating your surveyees?
                </option>
                <option value="1">Cash</option>
                <option value="2">Voucher</option>
                <option value="3">No remuneration given</option>
              </select>
              {errors?.remuneration_id
                ? renderErrorMsg("remuneration_id")
                : null}
            </div>

            <div class={`form-group ${styles.formGroup}`}>
              <label for="remunerationAmount">Remuneration Amount</label>
              <br></br>
              <small class="form-text text-muted">
                Leave blank if there is no remuneration for your survey
              </small>
              <br></br>
              <input
                type="number"
                name="remunerationAmount"
                {...register("remunerationAmount", {
                  required: requiredField(),
                  min: {
                    value: 1,
                    message: "Invalid amount. Please try again",
                  },
                })}
                value={remunerationAmount}
                onChange={(e) => {
                  register("remunerationAmount").onChange(e);
                  handleAmountInputChange(e);
                }}
                class="form-control"
                id={styles.remunerationAmount}
              ></input>
              {errors?.remunerationAmount
                ? renderErrorMsg("remunerationAmount")
                : null}
            </div>
          </div>
        </div>

        <div class={`form-group ${styles.formGroup}`}>
          <label for="closing_date" class={styles.requiredField}>
            Closing Date
          </label>
          <br></br>
          <input
            type="date"
            name="closing_date"
            min={new Date().toISOString().split("T")[0]}
            value={survey.closing_date}
            onChange={handleInputChange}
            id={styles.closingDate}
          ></input>
        </div>
      </section>

      <section id={styles.section2}>
        <h2 class={styles.sectionHeader}>Survey Requirements</h2>
        <div class="row">
          <div class="col-md-4">
            <div class={`form-group ${styles.formGroup}`}>
              <label for="genderEligibility" class={styles.requiredField}>
                Gender
              </label>
              <select
                class="form-select"
                name="genderEligibility"
                {...register("genderEligibility", {
                  required: "Please select a gender eligibility requirement",
                })}
                value={genderEligibility}
                onChange={(e) => {
                  register("genderEligibility").onChange(e);
                  handleGenderInputChange(e);
                }}
                id={styles.gender}
              >
                <option selected value="">
                  Seeking responses from...
                </option>
                <option value="1">Males only</option>
                <option value="2">Females only</option>
                <option value="3">No gender eligibility requirements</option>
              </select>
              {errors?.genderEligibility
                ? renderErrorMsg("genderEligibility")
                : null}
            </div>

            <div class={`form-group ${styles.formGroup}`}>
              <label for="min-age">Minimum Age</label>
              <br></br>
              <small class="form-text text-muted">
                Leave blank if there is no min. age requirement
              </small>
              <br></br>
              <input
                type="number"
                name="minAge"
                value={minAge}
                onChange={handleMinAgeInputChange}
                class="form-control"
                id={styles.minAge}
              ></input>
            </div>

            <div class={`form-group ${styles.formGroup}`}>
              <label for="max-age">Maximum Age</label>
              <br></br>
              <small class="form-text text-muted">
                Leave blank if there is no max. age requirement
              </small>
              <br></br>
              <input
                type="number"
                name="maxAge"
                value={maxAge}
                onChange={handleMaxAgeInputChange}
                class="form-control"
                id="max-age"
              ></input>
            </div>
          </div>
        </div>

        <div class={`form-group ${styles.formGroup}`}>
          <label for="ethnicity">Ethnicity</label>
          <br />
          <small class="form-text text-muted">
            Leave all boxes unchecked if there are no ethnicity requirements for
            your survey.
          </small>
          <div class="row">
            <div class="col-md-4">
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  name="chinese"
                  value={ethnicityEligibility.chinese}
                  onChange={handleCheckboxChange}
                  id="flexCheckDefault"
                ></input>
                <label
                  class={`form-check-label ${styles.race}`}
                  for="flexCheckDefault"
                >
                  Chinese
                </label>
              </div>

              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  name="malay"
                  value={ethnicityEligibility.malay}
                  onChange={handleCheckboxChange}
                  id="flexCheckDefault"
                ></input>
                <label
                  class={`form-check-label ${styles.race}`}
                  for="flexCheckDefault"
                >
                  Malay
                </label>
              </div>

              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  name="indian"
                  value={ethnicityEligibility.indian}
                  onChange={handleCheckboxChange}
                  id="flexCheckDefault"
                ></input>
                <label
                  class={`form-check-label ${styles.race}`}
                  for="flexCheckDefault"
                >
                  Indian
                </label>
              </div>

              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  name="others"
                  value={ethnicityEligibility.others}
                  onChange={handleCheckboxChange}
                  id="flexCheckDefault"
                ></input>
                <label
                  class={`form-check-label ${styles.race}`}
                  for="flexCheckDefault"
                >
                  Others
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <div class={`form-group ${styles.formGroup}`}>
              <label for="other_eligibility_requirements">
                Other Requirements Not Stated Above
              </label>
              <br></br>
              <textarea
                type="text"
                name="other_eligibility_requirements"
                value={survey.other_eligibility_requirements}
                onChange={handleInputChange}
                class="form-control"
                id={styles.otherRequirements}
                placeholder="Have other eligibility requirements for your survey? List them here!"
              ></textarea>
            </div>
          </div>
        </div>
      </section>
    </form>
  );
}

export default CreateSurveyForm;
