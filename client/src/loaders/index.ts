import { LoaderFunction } from "react-router-dom";
import { Post } from "../types";
import axios, { AxiosResponse } from "axios";
interface HomePageLoader {
  message: string;
}

interface PostsLoaderFilter {
  title: string | null;
  author: string | null;
  tag: string | null;
  location: string | null;
  rating: number | null;
}

interface PostsPageLoader {
  posts: Post[];
  formValues: PostsLoaderFilter;
}

export const homeLoader = (async (): Promise<HomePageLoader> => {
  const response = await fetch("/api");
  const message: Promise<HomePageLoader> = response.json();
  return message;
}) satisfies LoaderFunction;

const countries = [];

export const postsLoader = (async ({ request }): Promise<PostsPageLoader> => {
  const url = new URL(request.url);
  const filter = {
    title: url.searchParams.get("title"),
    location: url.searchParams.get("location"),
    tag: url.searchParams.get("tag"),
    author: url.searchParams.get("author"),
    rating: Number(url.searchParams.get("rating")),
  };
  const posts = await retrievePosts(filter);
  return { posts, formValues: filter };
}) satisfies LoaderFunction;

export const postPageLoader = (async ({ params }): Promise<any> => {
  const { data: posts } = await axios.get(`/api/posts/${params.id}`);

  const { data: comments } = await axios.get(`/api/comments/${params.id}`);

  const { data: ratings } = await axios.get(`/api/ratings/${params.id}`);

  const post = posts![0] as Post;
  return { post, comments, ratings };
}) satisfies LoaderFunction;

export const dashboardLoader = async (): Promise<any> => {
  const { data: users }: AxiosResponse<[]> = await axios.get("/api/users");
  return users;
};

export const editPostLoader = (async ({ params }): Promise<Post> => {
  const { data } = await axios.get(`/api/posts/${params.id}`);

  const post = data![0] as Post;
  return post;
}) satisfies LoaderFunction;

export const retrievePosts = async (
  filter: PostsLoaderFilter
): Promise<Post[]> => {
  const { data: posts } = await axios.get("/api/posts", {
    params: {
      title: filter.title,
      author: filter.author,
      tag: filter.tag,
      location: filter.location,
    },
  });
  return posts as Post[];
};

export const profilePageLoader = (userId: string) =>
  (async () => {
    const { data: posts } = await axios.get(`/api/posts/user/${userId}`);
    const { data: ratings } = await axios.get(`/api/ratings/user/${userId}`);
    return { ratings, posts };
  }) satisfies LoaderFunction;
