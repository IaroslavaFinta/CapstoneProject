export default function ForgotPassword() {
  return (
    <>
      <h3 className="text-2xl">
        Please enter your email that you used for registration and use a link
        their to set up a new password
      </h3>
      <form className="form">
        <label htmlFor={"email"} className="email">
          Email address: <input type={"email"} />
        </label>
        <button
        className="border-2 border-solid border-inherit
        bg-white p-2 rounded-lg text-base m-2.5"
        >Submit</button>
      </form>
    </>
  );
}
