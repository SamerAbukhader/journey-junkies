import { LoaderFunction } from "react-router-dom";

export type LoaderData<TLoaderFN extends LoaderFunction> = Awaited<
  ReturnType<TLoaderFN>
> extends Response | infer D
  ? D
  : never;

export interface Post {
  author: string;
  author_id?: string;
  author_name?: string;
  id: string;
  title: string;
  description: string;
  content: string;
  image: string;
  tag: string;
  location: string;
  created_at: string;
}

export interface Tag {
  id: string;
  title: string;
}

export interface User {
  avatar: string;
  name: string;
  email: string;
  isadmin: boolean;
  isverified: boolean;
  joinDate: string;
  activeDate: string;
}

export type Location =
  | "All"
  | "Europe"
  | "Stories"
  | "Asia"
  | "America"
  | "Africa"
  | "Oceania";
