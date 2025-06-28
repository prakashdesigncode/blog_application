import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fromJS, List, Map } from "immutable";
import { useNavigate } from "react-router-dom";
import { authLogin, authRegister } from "../Redux/Dashboard_Redux/thunk";

/*------------------------Utils Start--------------------------*/
const initialize = { email: "", password: "" };
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
export const useInfiniteScroll = (selector, action, ...args) => {
  const [state, setState] = useState(List([]));
  const [page, setPage] = useState(1);
  const ref = useRef(null);
  const [data] = useGetApiData(selector, action, ...args);
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
  const [handleRegister] = useCallDispatch(authRegister);
  const [handleLogin] = useCallDispatch(authLogin);
  const navigate = useNavigate();

  const registerCallBack = () => handleUserStay(true);
  const loginCallBack = () => {
    navigate("/photos");
  };

  const handleForm = (actionType) => () => {
    if (validateForm()) {
      if (actionType === "signin") {
        handleLogin({ value: inputRef.current, callBack: loginCallBack });
      } else {
        handleRegister({ value: inputRef.current, callBack: registerCallBack });
      }
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const validateForm = () => {
    const newErrors = { email: "", password: "" };
    let isValid = true;

    if (!inputRef.current.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(inputRef.current.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    if (!inputRef.current.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (!validatePassword(inputRef.current.password)) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setError(fromJS(newErrors));
    return isValid;
  };

  return [handleForm, error, setError, inputRef];
};

export const useDebounce = (value, delay = 300) => {
  const [state, setState] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => {
      setState(value);
    }, delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return [state];
};
