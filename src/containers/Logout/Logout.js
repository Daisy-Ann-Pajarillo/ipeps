import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';

import * as actions from '../../store/actions/index';

const Logout = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(actions.logout());
    }, [dispatch]);

    return <Navigate to='/' />;
};

export default Logout;
