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

        {!isUserStay && (
          <div className="rounded flex  gap-3.5 bg-cyan-200 px-4 py-3 text-blue-950">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6 text-sky-400"
            >
              <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              Create like <span className="text-blue-950 font-bold">ram</span>{" "}
              with password{" "}
              <span className="text-blue-950 font-bold">1234@R</span>
            </div>
          </div>
        )}

        <div>
          <LoginCompound.Input
            type="username"
            ref={inputRef}
            error={error}
            setError={setError}
            isUserStay={isUserStay}
          />
        </div>
        <div>
          <LoginCompound.Input
            type="password"
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
      ref.current[type] = state.trim();
      setError((prev) =>
        state.length < 4
          ? prev.set(type, `${type} Minimum 4 Characters`)
          : prev.delete(type)
      );
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
      <div className="font-bold mt-2 text-red-600">{error.get(type, "")}</div>
    </div>
  );
};

LoginCompound.Label = ({ children }) => {
  return <label>{children}</label>;
};

LoginCompound.Button = ({ children, click, error, isUserStay }) => {
  return (
    <button
      className="bg-blue-950 w-full py-3 text-white font-bold rounded"
      onClick={() => click(error.size)}
    >
      {children}
    </button>
  );
};

export default LoginCompound;
