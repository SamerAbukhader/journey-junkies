import { NonIndexRouteObject, redirect, useNavigate } from "react-router-dom";
import axios from "axios";

// Action for creating a new post
export const newPostAction: NonIndexRouteObject["action"] = async ({
  request,
}) => {
  // Parse form data
  const data = await request.formData();
  const post = {
    // Extract post data from form
    title: data.get("title"),
    description: data.get("description"),
    location: data.get("location"),
    content: data.get("content"),
    image: data.get("image"),
    tag: data.get("tag"),
    author: data.get("author"),
    map_coords: data.get("map_coords"),
  };
  // Send post data to the server
  await axios.post("/api/posts", post);
  // Redirect to the home page after successful post creation
  return redirect("/");
};

// Actions for post page interactions (delete, comment, rate)
export const postPageActions: NonIndexRouteObject["action"] = async ({
  params,
  request,
}) => {
  let formData = await request.formData();
  let intent = formData.get("intent");

  // Delete post
  if (intent === "delete") {
    await axios.delete(`/api/posts/${params.id}`);
    return redirect("/");
  }

  // Add comment to post
  if (intent === "comment") {
    await postComment(
      params.id || "",
      formData.get("comment") as string,
      formData.get("author") as any,
      formData.get("author_id") as any
    );
    return redirect(`/${params.id}`);
  }

  // Rate post
  if (intent === "rate") {
    await postRating(
      params.id || "",
      formData.get("user") as any,
      Number(formData.get("rate")),
      formData.get("post_author") as any
    );
    return redirect(`/${params.id}`);
  }
};

// Action for editing an existing post
export const editPostAction: NonIndexRouteObject["action"] = async ({
  params,
  request,
}) => {
  const data = await request.formData();
  const { id } = params;
  const post = {
    title: data.get("title"),
    description: data.get("description"),
    location: data.get("location"),
    content: data.get("content"),
    image: data.get("image"),
    tag: data.get("tag"),
    author: data.get("author"),
  };
  // Send updated post data to the server
  await axios.put(`/api/posts/${id}`, post);
  // Redirect to the edited post
  return redirect(`/${id}`);
};

// Action for dashboard interactions (verify, change role, delete user)
export const dashboardAction: NonIndexRouteObject["action"] = async ({
  request,
}) => {
  const formData = await request.formData();
  const formValues = formData.get("value");
  const { value, id, metaData } = JSON.parse(String(formValues));

  // Verify user
  if (value === "verify") {
    await verifyUser(id, metaData);
    return redirect("");
  }

  // Change user role
  if (value === "role") {
    await adminUser(id, metaData);
    return redirect("");
  }

  // Delete user
  if (value === "delete") {
    await deleteUser(id);
    return redirect("");
  }
};

// Helper function for handling post ratings
const postRating = async (
  postId: string,
  user: string,
  rating: Number,
  post_author: string
) => {
  const { data: ratings } = await axios.get(
    `/api/ratings/user/${user}/${postId}`
  );
  if (ratings?.length) {
    await axios.put(`/api/ratings/${ratings[0].id}`, {
      rating: rating,
    });
  } else {
    await axios.post("/api/ratings", {
      post_id: postId,
      user: user,
      post_author: post_author,
      rating: rating,
    });
  }
};

// Helper function for handling post comments
const postComment = async (
  postId: string,
  comment: string,
  user: any,
  author_id: any
) => {
  await axios.post("/api/comments", {
    post_id: postId,
    comment: comment,
    name: user,
    user_id: author_id,
  });
};

// Helper function for deleting a user and associated posts, comments, and ratings
const deleteUser = async (id: string) => {
  const response = await axios.delete(`/api/users/${id}`, {
    data: {
      id: id,
    },
  });
  // If user is deleted, delete all posts, comments, and ratings by that user
  if (response.status === 200) {
    await axios.delete(`/api/posts/user/${id}`);
    await axios.delete(`/api/comments/user/${id}`);
    await axios.delete(`/api/ratings/user/${id}`);
  }
};

// Helper function for verifying a user
const verifyUser = async (id: string, v: any) => {
  let newMta = v;
  newMta["verified"] = !v["verified"];
  const response: any = await axios.patch(`/api/users/${id}/verify`, {
    id: id,
    verified: v,
  });
};

// Helper function for changing a user's role
const adminUser = async (id: string, v: any) => {
  let newMta = v;
  newMta["admin"] = !v["admin"];
  const response = await axios.patch(`/api/users/${id}/changeRole`, {
    id: id,
    isadmin: newMta,
  });
};
