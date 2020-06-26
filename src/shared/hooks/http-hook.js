import { useState, useCallback, useRef, useEffect } from "react";
const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  
    const activeHtttpRequests=useRef([]);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);
      const httpAbortCtrl=new AbortController();
      //add current request to active Requests
      activeHtttpRequests.current.push(httpAbortCtrl)
      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal:httpAbortCtrl.signal
        });

        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message);
        }
        activeHtttpRequests.current=activeHtttpRequests.current.filter(reqCtrl=>reqCtrl!==httpAbortCtrl);
        setIsLoading(false);
        return responseData;
      } catch (err) {
        setIsLoading(false);
        setError(err.message);
        throw err;
      }
      
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  useEffect(()=>{
      //it will run when component is unmount.
      return ()=>{
          activeHtttpRequests.current.forEach(abortCtrl=>abortCtrl.abort());
      };
  },[])
  return { isLoading, error, sendRequest, clearError };
};

export default useHttpClient;