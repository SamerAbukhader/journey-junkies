import { NonIndexRouteObject, redirect, useNavigate } from "react-router-dom";
import axios from "axios";

// // Create an Axios instance with a custom base URL
// const axios. = axios.create({
//   baseURL: "http://journyjunkies.ddns.net:8081",
// });

export const newPostAction: NonIndexRouteObject["action"] = async ({
  request,
}) => {
  const data = await request.formData();
  const post = {
    title: data.get("title"),
    description: data.get("description"),
    location: data.get("location"),
    content: data.get("content"),
    image: data.get("image"),
    tag: data.get("tag"),
    author: data.get("author"),
    map_coords: data.get("map_coords"),
  };
  await axios.post("/api/posts", post);
  return redirect("/");
};

export const postPageActions: NonIndexRouteObject["action"] = async ({
  params,
  request,
}) => {
  let formData = await request.formData();
  let intent = formData.get("intent");
  if (intent === "delete") {
    await axios.delete(`/api/posts/${params.id}`);
    return redirect("/");
  }
  if (intent === "comment") {
    await postComment(
      params.id || "",
      formData.get("comment") as string,
      formData.get("author") as any,
      formData.get("author_id") as any
    );
    return redirect(`/${params.id}`);
  }
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
  await axios.put(`/api/posts/${id}`, post);
  return redirect(`/${id}`);
};

export const dashboardAction: NonIndexRouteObject["action"] = async ({
  request,
}) => {
  const formData = await request.formData();
  const formValues = formData.get("value");
  const { value, id, metaData } = JSON.parse(String(formValues));

  if (value === "verify") {
    await verifyUser(id, metaData);
    return redirect("");
  }
  if (value === "role") {
    await adminUser(id, metaData);
    return redirect("");
  }
  if (value === "delete") {
    await deleteUser(id);
    return redirect("");
  }
};

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

const deleteUser = async (id: string) => {
  const response = await axios.delete(`/api/users/${id}`, {
    data: {
      id: id,
    },
  });
  // if user is deleted, delete all posts and comments and ratings by that user
  if (response.status === 200) {
    await axios.delete(`/api/posts/user/${id}`);
    await axios.delete(`/api/comments/user/${id}`);
    await axios.delete(`/api/ratings/user/${id}`);
  }
};

const verifyUser = async (id: string, v: any) => {
  let newMta = v;
  newMta["verified"] = !v["verified"];
  const response: any = await axios.patch(`/api/users/${id}/verify`, {
    id: id,
    verified: v,
  });
};

const adminUser = async (id: string, v: any) => {
  let newMta = v;
  newMta["admin"] = !v["admin"];
  const response = await axios.patch(`/api/users/${id}/changeRole`, {
    id: id,
    isadmin: newMta,
  });
};
