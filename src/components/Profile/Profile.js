import styles from "./Profile.module.css";
import Navbar from "../navbar/Navbar";
import avatarImg from "../../assets/avatar.png";
import { useEffect, useState } from "react";
import { supabaseClient } from "../../lib/client";
import { useAuth } from "../../contexts/Auth";
import { useForm } from "react-hook-form";

function Profile() {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  return (
    <>
      <Navbar />
      <div className={styles.pageContainer}>
        <div className={styles.pageBody}>
          {hasSubmitted && (
            <div
              className="alert alert-success alert-dismissible fade show offset-md-4 col-md-4"
              role="alert"
            >
              Successfully saved changes
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="alert"
                aria-label="Close"
                onClick={() => setHasSubmitted(false)}
              />
            </div>
          )}
          <h1 className={styles.profilePageHeader}>Edit Profile</h1>
          <EditProfileForm setHasSubmitted={setHasSubmitted} />
        </div>
      </div>
    </>
  );
}

function EditProfileForm(props) {
  const { userInfo } = useAuth();

  const [currAvatarURL, setCurrAvatarURL] = useState(null);
  console.log(currAvatarURL);
  const [prevAvatarURL, setPrevAvatarURL] = useState(null);
  useEffect(() => {
    GetAvatar(userInfo.email, setCurrAvatarURL, setPrevAvatarURL);
  }, []);

  const [currAvatarFile, setCurrAvatarFile] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      firstName: userInfo.full_name.split(" ")[0],
      lastName: userInfo.full_name.split(" ")[1],
      email: userInfo.email,
      gender: userInfo.gender,
      dateOfBirth: userInfo.date_of_birth,
      ethnicity: getEthnicityFromId(userInfo.ethnicity_id),
      notification: userInfo.notification,
    },
  });

  const onSubmit = (data) => {
    console.log(data);
    UpdateDB(data, currAvatarFile, currAvatarURL, prevAvatarURL);
    props.setHasSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  function handleUpdateFile(e) {
    if (e.target.files[0]) {
      setCurrAvatarFile(e.target.files[0]);
      setCurrAvatarURL(URL.createObjectURL(e.target.files[0]));
    }
  }

  function handleDeleteFile() {
    setCurrAvatarFile(null);
    setCurrAvatarURL(null);
  }

  console.log(prevAvatarURL, currAvatarURL, currAvatarFile);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.formBody}>
        <div className={styles.avatarSection}>
          <h2 className={styles.sectionHeader}>Avatar</h2>
          <div>
            {!currAvatarURL ? (
              <img src={avatarImg} className={styles.avatarImg} />
            ) : (
              <img src={currAvatarURL} className={styles.selectedImg} />
            )}
          </div>
          <div>
            <input
              type="file"
              name="avatar"
              onChange={(e) => handleUpdateFile(e)}
            />
            <input
              type="button"
              value="Delete picture"
              onClick={() => handleDeleteFile()}
            />
          </div>
        </div>
        <div className={styles.profileInfoSection}>
          <h2 className={styles.sectionHeader}>Profile Information</h2>
          <div className="row mb-3">
            <div className="col-md-3">
              <label for="firstName" className="form-label">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                className="form-control"
                {...register("firstName", {
                  required: "First name is required.",
                })}
              />
              <p className={styles.validation}>{errors.firstName?.message}</p>
            </div>
            <div className="offset-md-1 col-md-3">
              <label for="lastName" className="form-label">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                className="form-control"
                {...register("lastName", {
                  required: "Last name is required.",
                })}
              />
              <p className={styles.validation}>{errors.lastName?.message}</p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-5">
              <label for="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                name="email"
                className="form-control"
                {...register("email")}
                disabled
              />
            </div>
          </div>
        </div>
        <div className={styles.demographicsSection}>
          <h2 className={styles.sectionHeader}>Demographics</h2>
          <div className="row mb-3">
            <div className="col-md-2">
              <label for="gender" className="form-label">
                Gender
              </label>
              <select
                name="gender"
                className="form-select"
                {...register("gender")}
              >
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
            <div className="offset-md-2 col-md-3">
              <label for="dateOfBirth" className="form-label">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                className="form-control"
                max={new Date().toISOString().split("T")[0]}
                {...register("dateOfBirth")}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-3">
              <label for="ethnicity" className="form-label">
                Ethnicity
              </label>
              <select
                name="gender"
                className="form-select"
                {...register("ethnicity")}
              >
                <option>Chinese</option>
                <option>Malay</option>
                <option>Indian</option>
                <option>Others</option>
              </select>
            </div>
          </div>
        </div>
        <div className={styles.notifSection}>
          <h2 className={styles.sectionHeader}>Notification</h2>
          <div className="form-check">
            <input
              type="checkbox"
              name="notification"
              className="form-check-input"
              {...register("notification")}
            />
            <label for="notification" className="form-check-label">
              Opt in: Enable email notification for expiring surveys that you
              have wishlisted but yet to mark as complete
            </label>
          </div>
        </div>
      </div>
      <div className={styles.saveChangesButtonContainer}>
        {isDirty || currAvatarURL !== prevAvatarURL ? (
          <button className={styles.saveChangesButton}>Save changes</button>
        ) : (
          <button className={styles.saveChangesButton} disabled>
            Save changes
          </button>
        )}
      </div>
    </form>
  );
}

async function GetAvatar(userEmail, setCurrAvatarURL, setPrevAvatarURL) {
  const { data, error } = await supabaseClient
    .from("users")
    .select("avatar")
    .eq("email", userEmail)
    .then((photoLocation) => {
      if (photoLocation.data[0].avatar) {
        return supabaseClient.storage
          .from("avatar-images")
          .getPublicUrl(photoLocation.data[0].avatar);
      } else {
        return { publicURL: null };
      }
    });

  if (error) {
    console.log(error);
  }
  if (data) {
    console.log(data);
    setCurrAvatarURL(data.publicURL);
    setPrevAvatarURL(data.publicURL);
    return data.publicURL;
  }
  return null;
}

function getEthnicityFromId(id) {
  if (id === 1) {
    return "Chinese";
  } else if (id === 2) {
    return "Malay";
  } else if (id === 3) {
    return "Indian";
  } else {
    return "Others";
  }
}

function getIdFromEthnicity(ethnicity) {
  if (ethnicity === "Chinese") {
    return 1;
  } else if (ethnicity === "Malay") {
    return 2;
  } else if (ethnicity === "Indian") {
    return 3;
  } else {
    return 4;
  }
}

async function UpdateDB(
  newProfile,
  currAvatarFile,
  currAvatarURL,
  prevAvatarURL
) {
  const {
    firstName,
    lastName,
    email,
    gender,
    dateOfBirth,
    ethnicity,
    notification,
  } = newProfile;
  const fullName = firstName + " " + lastName;
  const ethnicityId = getIdFromEthnicity(ethnicity);

  const { data, error } = await supabaseClient
    .from("users")
    .update({
      full_name: fullName,
      gender: gender,
      date_of_birth: dateOfBirth,
      ethnicity_id: ethnicityId,
      notification: notification,
    })
    .eq("email", email);

  if (error) {
    console.log(error);
  }

  // Update storage for avatar images. TODO: Remove image from data base (needed??)
  // if no change: do nothing
  console.log(prevAvatarURL, currAvatarURL);
  if (prevAvatarURL === currAvatarURL) {
  }
  // if deleted: remove from storage. update users table
  else if (!currAvatarURL) {
    const { data: users, error: users_error } = await supabaseClient
      .from("users")
      .update({ avatar: "" })
      .eq("email", email);
  }
  // if updated, remove prev from storage, insert new avatar into storage. update users table
  else {
    const { data: avatar_images, error: avatar_images_error } =
      await supabaseClient.storage
        .from("avatar-images")
        .upload(`public/${currAvatarURL}`, currAvatarFile);
    const { data: users, error: users_error } = await supabaseClient
      .from("users")
      .update({ avatar: `public/${currAvatarURL}` })
      .eq("email", email);
  }
}

export default Profile;
