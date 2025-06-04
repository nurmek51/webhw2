import { useEffect } from "react";

export const Settings = () => {
  useEffect(() => {
    return () => {
      console.log("leave settings");
    };
  }, []);
  return <div>settings</div>;
};
