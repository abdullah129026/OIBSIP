import { AppleIcon, FacebookIcon, GoogleIcon } from "./icons";

const providers = [
  { name: "Google", Icon: GoogleIcon },
  { name: "Facebook", Icon: FacebookIcon },
  { name: "Apple", Icon: AppleIcon },
];

export default function SocialButtons() {
  return (
    <div className="social-row">
      {providers.map(({ name, Icon }) => (
        <button
          key={name}
          type="button"
          className="social-btn"
          aria-label={`Sign in with ${name}`}
        >
          <Icon />
        </button>
      ))}
    </div>
  );
}
