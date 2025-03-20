import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';

import * as actions from '../../store/actions/auth';

const Logout = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(actions.logout()); // Call the action creator correctly
    }, [dispatch]);

    return <Navigate to="/" replace />; // Ensure smooth redirection
};

export default Logout;
