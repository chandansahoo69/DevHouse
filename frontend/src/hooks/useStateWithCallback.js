import { useCallback, useEffect, useRef, useState } from "react";

export const useStateWithCallback = (initialState) => {
  const [state, setState] = useState(initialState);
  const cbRef = useRef();

  const updateState = useCallback((newState, cb) => {
    //store the callback in the reference
    cbRef.current = cb;

    //change the state
    setState((prev) => {
      return typeof newState === "function" ? newState(prev) : newState;
    });
  }, []);

  useEffect(() => {
    if (cbRef.current) {
      cbRef.current(state);
      cbRef.current = null;
    }
  }, [state]);

  return [state, updateState];
};
