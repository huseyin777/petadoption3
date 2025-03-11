import apiRequest from "./apiRequest";
import { defer } from "react-router-dom";

// In your route loader (e.g., src/lib/loaders.js)
export const singlePageLoader = async ({ params }) => {
  try {
    const res = await apiRequest.get(`/posts/${params.id}`);
    return res.data;
  } catch (err) {
    throw {
      status: err.response?.status || 500,
      data: err.response?.data?.message || "Failed to fetch post",
    };
  }
};
export const listPageLoader = async ({ request, params }) => {
  const query = request.url.split("?")[1];
  const postPromise = apiRequest("/posts?" + query);
  return defer({
    postResponse: postPromise,
  });
};

export const profilePageLoader = async () => {
  try {
    const postPromise = apiRequest("/users/profilePosts");
    const chatPromise = apiRequest("/chats");
    return defer({
      postResponse: postPromise,
      chatResponse: chatPromise,
    });
  } catch (err) {
    throw new Response("Failed to load profile data", { status: 500 });
  }
};
