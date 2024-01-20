import { Container } from "./components/layout";
import { SignedIn, useUser } from "@clerk/clerk-react";
import {
  Dashboard,
  Error,
  Home,
  Post,
  User,
  Write,
  EditPost
} from "./pages";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from "react-router-dom";
import {
  dashboardAction,
  editPostAction,
  newPostAction,
  postPageActions
} from "./actions";
import {
  dashboardLoader,
  editPostLoader,
  postPageLoader,
  postsLoader,
  profilePageLoader
} from "./loaders";
import { Footer } from "./components/UI/Footer";

function App() {
  const { user } = useUser();

  const newRouter = createBrowserRouter(
      
    createRoutesFromElements(
     
      <Route path="/" element={<Container />} errorElement={<Error />}>
        <Route index element={<Home />} loader={postsLoader} />
        <Route
          path=":id"
          element={<SignedIn><Post /></SignedIn>}
          loader={postPageLoader}
          id="post"
          action={postPageActions}
        />
        <Route
          path=":id/edit"
          element={<EditPost />}
          loader={editPostLoader}
          action={editPostAction}
        />
        <Route path="write" element={<Write />} action={newPostAction} />
        <Route
          path="dashboard"
          element={<Dashboard />}
          loader={dashboardLoader}
          action={dashboardAction}
        />
        <Route
          path="profile"
          element={<User />}
          loader={profilePageLoader(user?.id ?? "")}
        />
      </Route>
      
    )
  );

  return <RouterProvider router={newRouter} />;
}

export default App;
