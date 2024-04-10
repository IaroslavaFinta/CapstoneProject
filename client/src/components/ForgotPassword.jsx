export default function ForgotPassword() {
  return (
    <>
      <h3>
        Please enter your email that you used for registration and use a link
        their to set up a new password
      </h3>
      <form className="form">
        <label htmlFor={"email"} className="email">
          Email address: <input type={"email"} />
        </label>
        <button>Submit</button>
      </form>
    </>
  );
}
