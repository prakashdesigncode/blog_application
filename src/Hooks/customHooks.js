import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { List } from "immutable";

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
export const useInfinateScroll = (selector, action) => {
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
