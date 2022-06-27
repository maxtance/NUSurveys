import { useEffect, useState } from "react";
import { useAuth } from "../contexts/Auth";
import { supabaseClient } from "../lib/client";

// function useFetchUser() {
//   const [data, setData] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const { user } = useAuth();
//   const userEmail = user?.email;

//   useEffect(() => {
//     (async () => {
//       const newData = await fetchUserInfo(userEmail);
//       setData(newData);
//       setIsLoading(false);
//     })();
//   }, []);

//   return { userInfo: data, userInfoIsLoading: isLoading };
// }

// async function fetchUserInfo(userEmail) {
//   console.log("fetching data from users");
//   const { data: users, error } = await supabaseClient
//     .from("users")
//     .select("*")
//     .eq("email", userEmail);

//   if (error) {
//     console.log(error);
//   }

//   return users[0];
// }

function useFetchUser() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const userEmail = user?.email;

  const fetchUserInfo = async (userEmail) => {
    console.log("fetching data from users");
    const { data: users, error } = await supabaseClient
      .from("users")
      .select("*")
      .eq("email", userEmail);
    if (error) {
      console.log(error);
    }

    setData(users[0]);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUserInfo(userEmail);
  }, [userEmail]);

  return { userInfo: data, userInfoIsLoading: isLoading };
}

export default useFetchUser;
