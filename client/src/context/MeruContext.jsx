import React, { createContext, useState, useContext, useEffect } from 'react';
import API from '../api/axiosClient';

const MeruContext = createContext();

export const MeruProvider = ({ children }) => {
  const [n, setN] = useState(6);
  const [r, setR] = useState(3);
  const [mode, setMode] = useState('memo'); // 'naive' | 'memo' | 'tabulation'
  
  const [triangleRows, setTriangleRows] = useState([]);
  const [computationResult, setComputationResult] = useState(null);
  const [benchmarkResult, setBenchmarkResult] = useState(null);

  const [loadingTriangle, setLoadingTriangle] = useState(false);
  const [loadingCompute, setLoadingCompute] = useState(false);
  const [loadingBenchmark, setLoadingBenchmark] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Automatically load default triangle on mount
  useEffect(() => {
    generateTriangle(6);
  }, []);

  const generateTriangle = async (numN) => {
    setLoadingTriangle(true);
    setErrorMsg('');
    try {
      const res = await API.post('/meru/generate', { n: numN });
      setTriangleRows(res.data.rows);
      setN(numN);
      if (r > numN) setR(Math.floor(numN / 2));
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to generate Meru-Prastāra triangle.');
    } finally {
      setLoadingTriangle(false);
    }
  };

  const runComputation = async (numN, numR, selMode) => {
    setLoadingCompute(true);
    setErrorMsg('');
    try {
      const endpoint = `/compute/${selMode}`;
      const res = await API.post(endpoint, { n: numN, r: numR });
      setComputationResult(res.data);
      setN(numN);
      setR(numR);
      setMode(selMode);
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setErrorMsg(msg);
      throw new Error(msg);
    } finally {
      setLoadingCompute(false);
    }
  };

  const runBenchmark = async (numN, numR) => {
    setLoadingBenchmark(true);
    setErrorMsg('');
    try {
      const res = await API.post('/benchmark/compare', { n: numN, r: numR });
      setBenchmarkResult(res.data);
      setN(numN);
      setR(numR);
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setErrorMsg(msg);
      throw new Error(msg);
    } finally {
      setLoadingBenchmark(false);
    }
  };

  return (
    <MeruContext.Provider
      value={{
        n,
        setN,
        r,
        setR,
        mode,
        setMode,
        triangleRows,
        computationResult,
        benchmarkResult,
        loadingTriangle,
        loadingCompute,
        loadingBenchmark,
        errorMsg,
        setErrorMsg,
        generateTriangle,
        runComputation,
        runBenchmark
      }}
    >
      {children}
    </MeruContext.Provider>
  );
};

export const useMeru = () => useContext(MeruContext);
