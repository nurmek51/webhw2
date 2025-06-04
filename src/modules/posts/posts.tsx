import { useEffect } from "react";

export const Posts = () => {
  useEffect(() => {
    return () => {
      console.log("leave posts");
    };
  }, []);
  return <div>posts</div>;
};
