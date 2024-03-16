import PasswordForm from "./PasswordForm";
import SettingsForm from "./SettingsForm";

const Settings = () => {
  return (
    <section className="account-content-list settings">
      <SettingsForm />
      <PasswordForm />
    </section>
  );
};

export default Settings;
