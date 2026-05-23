import type { accountT } from "../accountType";
import avatar_test from "../../assets/avatars/avatar1.png";

export function generateFakeAccount(): accountT {
  return {
    username: "Alex le mec qui critique les autres mais qui est pas mieux, genre vraiment un hypocrite ce mec",
    email: "atomasi42@proton.me",
    avatar: avatar_test,
    date_joined: "04-02-2042",
    is_online: true,
    last_login: "28-04-2025",
    is_friend: true,
  };
}
