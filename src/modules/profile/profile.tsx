import { useEffect, useState } from "react";
import type { User } from "../../shared/model/types.ts";

export const Profile = () => {
  const [user, setUser] = useState<User>({
    name: "Ilya Kuleshov",
    description: "lorem ipsum",
    imgSrc: "/images/ilya.jpeg",
  });
  useEffect(() => {
    // setUser({ ...user, name: "Shoqan" });
  }, [user]);
  return (
    <div className={"w-full h-screen flex flex-col gap-y-5 p-5 bg-orange-500"}>
      <div className={"w-full flex items-center gap-x-8"}>
        <img
          src={user.imgSrc}
          alt="ilya"
          className={"w-50 h-50 rounded-full"}
          onClick={() => {
            setUser({ ...user, name: "Bakhredin" });
          }}
        />
        <p className={"text-xl text-white"}>{user.name}</p>
      </div>
      <div
        className={
          "w-full h-30 border-5 rounded-lg bg-white border-purple-500 flex items-center justify-center text-center"
        }
      >
        {user.description}
      </div>
    </div>
  );
};

// class Profile {
//   componentDidMount() {
//     console.log("mounted");
//   }
//   componentWillUpdate() {
//     console.log("updated");
//   }
//   componentWillUnmount() {
//     console.log("unmounted");
//   }
// }
