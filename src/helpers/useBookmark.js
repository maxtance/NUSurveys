import { useEffect, useState } from "react";
import { supabaseClient } from "../lib/client";
import { useAuth } from "../contexts/Auth";

function useBookmark(initValue, surveyId) {
  // testing
  const { userInfo } = useAuth();
  const userId = userInfo.id;

  const [isBookmarked, setIsBookmarked] = useState(initValue);
  // useState will only use initValue on first render.
  useEffect(() => setIsBookmarked(initValue), [initValue]);

  // const { userInfo, userInfoIsLoading } = useFetchUser();
  // const userId = userInfo?.id;

  function setAndUpdateIsBookmarked() {
    setIsBookmarked((prevState) => !prevState);
    updateWishlistDb(isBookmarked, surveyId, userId);
  }

  return [isBookmarked, setAndUpdateIsBookmarked];
}

async function updateWishlistDb(isBookmarked, surveyId, userId) {
  if (isBookmarked) {
    // remove wishlist data from database
    const { data, error } = await supabaseClient
      .from("wishlisted_surveys")
      .delete()
      .eq("survey_id", surveyId);

    if (error) {
      console.log(error);
    }
  } else {
    // add wishlist data to database
    let currDate = new Date();
    let todaysDate = `${currDate.getFullYear()}-${String(
      currDate.getMonth() + 1
    ).padStart(2, 0)}-${String(currDate.getDate()).padStart(2, 0)}`;
    const { data, error } = await supabaseClient
      .from("wishlisted_surveys")
      .insert([
        {
          survey_id: String(surveyId),
          user_id: String(userId),
          date_added: String(todaysDate),
        },
      ]);
    if (error) {
      console.log(error);
    }
  }
}

export default useBookmark;
