import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { List, Map } from "immutable";
import { useNavigate } from "react-router-dom";

/*------------------------Utils Start--------------------------*/
const validation = [undefined, null, ""];
const initialize = { username: "", password: "" };
/*------------------------Utils End----------------------------*/

/* 
 @params : param1 : Number || String 
 @return : [Number || String , function]
*/
export const useInputHook = (defaultValue = "") => {
  const [state, setState] = useState(defaultValue);
  const handleState = (event) => setState(event.target.value);
  return [state, handleState];
};

/* 
 @params : param1 : Boolean
 @return : [Boolean , function]
*/
export const useBooleanHook = (defaultValue = "") => {
  const [boolean, setBoolean] = useState(defaultValue);
  const handleState = (value) => setBoolean(value);
  return [boolean, handleState];
};

/* 
 @params : param1 : function 
 @return : [function]
*/
export const useCallDispatch = (action) => {
  const dispatch = useDispatch();
  const handleDispatch = (...args) => dispatch(action(...args));
  return [handleDispatch];
};

/* 
 @params : param1 : function , param2 : function , param3 : anything
 @return : [function]
*/
export const useGetApiData = (selector, action, ...args) => {
  const reduxSelector = useSelector(selector);
  const [getApi] = useCallDispatch(action);
  useEffect(() => {
    if (reduxSelector.size === 0) getApi(...args);
  }, []);
  return [reduxSelector];
};

/* 
 @params : param1 : function 
 @return : [anything]
*/
export const useSelectedValue = (selector) => {
  const reduxSelector = useSelector(selector);
  return [reduxSelector];
};

/* 
 @params : param1 : function , param2 : function
 @return : [array,function]
*/
export const useInfiniteScroll = (selector, action) => {
  const [state, setState] = useState(List([]));
  const [page, setPage] = useState(1);
  const ref = useRef(null);
  const [data] = useGetApiData(selector, action);
  const isInterSecting = (node) => {
    if (ref.current) ref.current.disconnect();
    ref.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setPage((prev) => prev + 1);
    });
    if (node) ref.current.observe(node);
  };
  useEffect(() => {
    if (data.size) setState(data.splice(page * 10));
  }, [page, data]);
  return [state, isInterSecting];
};

export const useFormValidation = (handleUserStay) => {
  const [error, setError] = useState(Map());
  const inputRef = useRef(initialize);

  const [handleAuthSignIn, handleAuthSignUp] = useAuthLogin(
    inputRef,
    handleUserStay
  );

  const handleError = (value) => (message) => {
    setError((prev) => prev.set(value, message));
  };
  const handleForm = (type) => (size) => {
    let valid = true;
    const { username, password } = inputRef.current;
    [username, password].forEach((value, index) => {
      const previousUsers = JSON.parse(localStorage.getItem("users")) || {};
      const objectKeys = Object.keys(previousUsers);
      const fields = ["username", "password"];
      const isCheck = objectKeys.findIndex((element) => {
        const spited = element.split("+");
        return spited[0] === value;
      });
      const handleBoolean = handleError(fields[index]);
      if (validation.includes(value)) {
        handleBoolean(`Enter ${fields[index]}`);
        valid = false;
      } else if (value.length < 4) {
        handleBoolean(`${fields[index]} Minimum 4 Characters`);
        valid = false;
      } else if (isCheck >= 0 && index === 0 && type === "signup") {
        handleBoolean(`Already ${fields[index]} Exits`);
        valid = false;
      }
    });
    if (valid) {
      if (type === "signin") {
        return handleAuthSignIn(setError);
      } else {
        return handleAuthSignUp();
      }
    }
  };
  return [handleForm, error, setError, inputRef];
};

export const useAuthLogin = (inputRef, handleUserStay) => {
  const navigate = useNavigate();
  const handleAuthSignIn = (setError) => {
    const { username, password } = inputRef.current;
    const key = `${username}+${password}`;
    const previousUsers = JSON.parse(localStorage.getItem("users")) || {};
    const findUser = previousUsers[key];
    if (findUser) {
      localStorage.setItem("currentUser", JSON.stringify(findUser));
      navigate("/home?current=0");
    } else setError((prev) => prev.set("common", "User not found"));
  };
  const handleAuthSignUp = () => {
    const { username, password } = inputRef.current;
    const key = `${username}+${password}`;
    const previousUsers = JSON.parse(localStorage.getItem("users")) || {};
    previousUsers[key] = { username, password };
    localStorage.setItem("users", JSON.stringify(previousUsers));
    handleUserStay(true);
  };
  return [handleAuthSignIn, handleAuthSignUp];
};
