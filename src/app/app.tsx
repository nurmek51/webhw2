// import "./app.css";
// import type { FC } from "react"; // Remove or keep if needed elsewhere
// import { Button } from "../shared/ui/button.tsx"; // Remove or keep if needed elsewhere
// import { Wrapper } from "../shared/ui/wrapper.tsx"; // Remove
// import { Profile } from "../modules/profile/profile.tsx"; // Remove
import { Routes, Route } from 'react-router-dom';
// import { Posts } from "../modules/posts/posts.tsx"; // Remove
// import { Settings } from "../modules/settings/settings.tsx"; // Remove
import ChatLayout from '../components/ChatLayout';

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<ChatLayout />} />
      {/* Optional: Keep or remove other routes as needed */}
      {/* <Route path="profile" element={<Profile />} /> */}
      {/* <Route path="posts" element={<Posts />} /> */}
      {/* <Route path="settings" element={<Settings />} /> */}
    </Routes>
  );
};
