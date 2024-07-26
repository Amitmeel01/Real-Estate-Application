import axios from "axios";
import { defer } from "react-router-dom";

export const singlePageLoader = async ({ params }) => {
  try {
    console.log(params.id);
    const res = await axios(`http://localhost:8080/api/posts/${params.id}`, {
      withCredentials: true, //this is imprtant
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to load the post");
  }
};

export const EditPageLoader = async ({ params }) => {
  try {
    console.log(params.id);
    const { id } = params;
    const res = await axios(`http://localhost:8080/api/posts/${id}`, {
      withCredentials: true, //this is imprtant
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to load the post");
  }
};

export const listPageLoader = async ({ request, params }) => {
  const query = request.url.split("?")[1];
  console.log(query);

  try {
    
    const postPromise = await axios(
      `http://localhost:8080/api/posts?${query}`,
      {
        withCredentials: true, //this is imprtant
      }
    );
    console.log(postPromise);
    return defer({
      postResponse: postPromise,
    });
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to load the post");
  }
};

export const profilePageLoader = async () => {
  const postPromise = await axios(
    `http://localhost:8080/api/user/profilePosts`,
    {
      withCredentials: true, //this is imprtant
    }
  );

  const chatPromise = await axios(`http://localhost:8080/api/chat`, {
    withCredentials: true, //this is imprtant
  });

  return defer({
    postResponse: postPromise,
    chatResponse: chatPromise,
  });
};
