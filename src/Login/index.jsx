import React, { useEffect } from "react";
import {
  useInputHook,
  useBooleanHook,
  useFormValidation,
} from "../Hooks/customHooks";
import { TextField } from "@mui/material";
import { Map } from "immutable";

/*--------------------Utils Start------------------------*/
const inputSx = {
  "& .MuiInputLabel-root": {
    color: "#A3A3A3",
    fontSize: "18px",
    fontWeight: "bold",
  },
};

/*--------------------Utils End---------------------------*/

const LoginCompound = () => {
  const [isUserStay, handleUserStay] = useBooleanHook(true);

  const [handleForm, error, setError, inputRef] =
    useFormValidation(handleUserStay);

  return (
    <div className="w-full h-dvh flex items-center justify-center ">
      <div className="w-[31rem] px-5 py-1">
        <div className=" mb-10">
          <div className="text-center mb-4">
            <span className="font-bold text-4xl">
              <span className="text-sky-500">G</span>
              <span className="text-red-500">o</span>
              <span className="text-yellow-500">o</span>
              <span className="text-sky-500">g</span>
              <span className="text-green-500">l</span>
              <span className="text-red-500">e</span>
            </span>
            <span className="text-2xl mx-2">Photos</span>
          </div>
          <div className="text-[18px] font-bold ">
            Sign {isUserStay ? "in" : "up"} to your account
          </div>
          {isUserStay ? (
            <div className="mt-3 text-gray-400 font-bold">
              Don`t have an account?{" "}
              <span
                className="text-green-600 font-bold mx-1 cursor-pointer"
                onClick={() => handleUserStay(false)}
              >
                Get started
              </span>
            </div>
          ) : (
            <div className="mt-3 text-gray-400 font-bold">
              I have an account?{" "}
              <span
                className="text-green-600 font-bold mx-1 cursor-pointer"
                onClick={() => handleUserStay(true)}
              >
                Get started
              </span>
            </div>
          )}
        </div>

        <div>
          <LoginCompound.Input
            type="Email"
            ref={inputRef}
            error={error}
            setError={setError}
            isUserStay={isUserStay}
          />
        </div>
        <div>
          <LoginCompound.Input
            type="Password"
            ref={inputRef}
            error={error}
            setError={setError}
            isUserStay={isUserStay}
          />
        </div>
        {error.get("common", "") && (
          <div className="font-bold mb-2 text-red-600">
            {error.get("common", "")}
          </div>
        )}
        <div>
          <LoginCompound.Button
            click={handleForm(isUserStay ? "signin" : "signup")}
            error={error}
          >
            {isUserStay ? "Sign In" : "Sign Up"}
          </LoginCompound.Button>
        </div>
      </div>
    </div>
  );
};

LoginCompound.Input = ({ ref, type, error, setError, isUserStay }) => {
  const [state, handleChange] = useInputHook();
  useEffect(() => {
    if (state) {
      ref.current[type.toLowerCase()] = state.trim();
      setError((prev) => prev.set(type.toLowerCase(), ""));
    }
  }, [state]);

  useEffect(() => {
    handleChange({ target: { value: "" } });
    setError(Map());
  }, [isUserStay]);

  return (
    <div className="my-8">
      <TextField
        className="w-full"
        required
        id="outlined-required"
        label={type}
        placeholder={type}
        value={state}
        slotProps={{
          inputLabel: {
            shrink: true,
          },
        }}
        sx={inputSx}
        onChange={handleChange}
      />
      <div className="font-bold mt-2 text-red-600">
        {error.get(type.toLowerCase(), "")}
      </div>
    </div>
  );
};

LoginCompound.Label = ({ children }) => {
  return <label>{children}</label>;
};

LoginCompound.Button = ({ children, click }) => {
  return (
    <button
      className="bg-sky-600 w-full py-3 text-white font-bold rounded"
      onClick={click}
    >
      {children}
    </button>
  );
};

export default LoginCompound;
