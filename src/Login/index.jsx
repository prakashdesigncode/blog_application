import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInputHook, useBooleanHook } from "../Hooks/customHooks";
import {
  handleCreatinal,
  handleLocalStorage,
  operationLocalStorage,
} from "../Utils/customfunctions";
import { Map } from "immutable";

const LoginCompound = () => {
  const [isUserStay, handleUserStay] = useBooleanHook(false);
  const [error, setError] = useState(Map());

  const inputRef = useRef({ username: "", password: "" });
  const navigate = useNavigate();

  const handleSumbit = () => {
    const { username, password } = inputRef.current;
    const isValidate = operationLocalStorage({
      name: username,
      secrectKey: password,
    });

    if (username.length <= 0)
      setError((prev) => prev.set("username", "Enter User Name"));
    if (password.length <= 0)
      setError((prev) => prev.set("password", "Enter Password"));
    else if (password.length < 4)
      setError((prev) => prev.set("password", "Password Minimum 4 Characters"));
    else if (!isUserStay) handleCreatinal(inputRef, handleUserStay);

    if (typeof isValidate === "boolean" && isUserStay) {
      if (isValidate) return navigate("/dashboard/photos");
    }
  };

  useEffect(() => {
    const { username, password } = handleLocalStorage();
    if (username && password) handleUserStay(true);
  }, []);

  return (
    <div>
      <div>Bolgger</div>
      <div>
        <LoginCompound.Label>Username</LoginCompound.Label>
        <LoginCompound.Input
          type="username"
          ref={inputRef}
          error={error}
          setError={setError}
        />
      </div>
      <div>
        <LoginCompound.Label>Password</LoginCompound.Label>
        <LoginCompound.Input
          type="password"
          ref={inputRef}
          error={error}
          setError={setError}
        />
      </div>
      <div>
        <LoginCompound.Button click={handleSumbit}>
          {isUserStay ? "Login" : "Sign Up"}
        </LoginCompound.Button>
      </div>
    </div>
  );
};

LoginCompound.Input = React.memo(({ ref, type, error, setError }) => {
  const [state, handleChange] = useInputHook();
  useEffect(() => {
    if (state) {
      ref.current[type] = state;
      setError((prev) =>
        type === "password"
          ? state.length < 4
            ? prev
            : prev.set(type, "")
          : prev.set(type, "")
      );
    }
  }, [state]);
  return (
    <>
      <input value={state} onChange={handleChange} />
      <div>{error.get(type, "")}</div>
    </>
  );
});

LoginCompound.Label = React.memo(({ children }) => {
  return <label>{children}</label>;
});

LoginCompound.Button = React.memo(({ children, click }) => {
  return <button onClick={click}>{children}</button>;
});

export default LoginCompound;
