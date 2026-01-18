import "./styles/main.scss";
import "./components/button/button.scss";
import "./components/input/input.scss";
import "./components/link/link.scss";
import "./pages/login/login.scss";
import "./components/profile-field/profile-field.scss";
import "./components/modal/modal.scss";
import "./pages/register/register.scss";
import "./components/add-user-form/add-user-form.scss";
import "./pages/profile/profile.scss";
import "./pages/profile-edit/profile-edit.scss";
import "./pages/profile-password/profile-password.scss";
import "./pages/chat/chat.scss";
import "./components/avatar-upload/avatar-upload.scss";
import "./components/error-page/error-page.scss";
import "./components/chat-item/chat-item.scss";
import "./components/chat-header/chat-header.scss";
import "./components/chat-menu/chat-menu.scss";
import "./components/message-input/message-input.scss";
import "./components/avatar/avatar.scss";
import "./components/message/message.scss";

import { Router } from "./core";
import { RegisterPage } from "./pages/register";
import { ProfilePage } from "./pages/profile";
import { ProfileEditPage } from "./pages/profile-edit";
import { ProfilePasswordPage } from "./pages/profile-password";
import { Error404Page } from "./pages/error-404";
import { Error500Page } from "./pages/error-500";
import { ChatPage } from "./pages/chat";
import { LoginPage } from "./pages/login";

const router = new Router("#app");

router
  .use("/", LoginPage)
  .use("/sign-up", RegisterPage)
  .use("/settings", ProfilePage)
  .use("/messenger", ChatPage)
  .use("/profile-edit", ProfileEditPage)
  .use("/profile-password", ProfilePasswordPage)
  .use("/404", Error404Page)
  .use("/500", Error500Page);

router.start();

window.router = router;
