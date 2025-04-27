// src/hooks/useLeaderboard.js

import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchLeaderboard } from '../redux/features/leaderbaordSlice';

const useLeaderboard = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.leaderboard);

  useEffect(() => {
    dispatch(fetchLeaderboard());
  }, [dispatch]);

  return { users, loading, error };
};

export default useLeaderboard;
