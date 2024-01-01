import {
  Dashboard,
  Error,
  Home,
  Post,
  User,
  Write,
  EditPost,
} from "./pages";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  dashboardAction,
  editPostAction,
  newPostAction,
  postPageActions,
} from "./actions";
import {
  dashboardLoader,
  editPostLoader,
  postPageLoader,
  postsLoader,
  profilePageLoader,
} from "./loaders";
import { Container } from "./components/layout";
import { SignedIn, useUser } from "@clerk/clerk-react";

function App() {
  const { user } = useUser();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Container />}>
          <Route index element={<Home />} loader={postsLoader} />
          <Route
            path=":id"
            element={
              <SignedIn>
                <Post />
              </SignedIn>
            }
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
          <Route path="*" element={<Error />} /> // Catch-all error route
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
