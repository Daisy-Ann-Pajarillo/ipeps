import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';

import {
    Button,
    Container,
    FormControl,
    InputLabel,
    Input,
    InputAdornment,
    MenuItem,
    Select,
    Grid2 as Grid,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
} from '@mui/material';
import { AccountCircle, Email, Lock } from '@mui/icons-material';

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import * as actions from '../../store/actions/index';
import axios from '../../axios';

const schema = yup.object().shape({
    username: yup
        .string()
        .min(4, 'Username must be at least 4 characters')
        .required('Username is required'),
    email: yup.string().email().required('Email is required'),
    password: yup
        .string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
    passwordConfirmation: yup
        .string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
        .min(8, 'Password must be at least 8 characters')
        .required('Password confirmation is required'),
});

const userTypes = [
    'Select a User',
    'EMPLOYER',
    'JOBSEEKER',
    'ACADEME',
    'STUDENT',
    'ADMIN_LEVEL_1',
    'ADMIN_LEVEL_2',
];

const CreateUserModal = (props) => {
    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const [selectedUserType, setSelectedUserType] = useState('employer');
    const [isSendingForm, setIsSendingForm] = useState(false);
    const [sendingFormFinished, setSendingFormFinished] = useState(false);
    const [recaptchaValue, setRecaptchaValue] = useState();
    const [errorMsg, setErrorMsg] = useState('');
    const [registerButtonFirstClicked, setRegisterButtonFirstClicked] =
        useState(false);

    const onChange = (value) => {
        props.onVerifyCaptcha(value);
        setRecaptchaValue(value);
    };

    const onSubmit = (data) => {
        setIsSendingForm(true);
        setSendingFormFinished(false);
        registerUser({
            user_type: selectedUserType,
            username: data.username,
            email: data.email,
            password: data.password,
            recaptchaValue: recaptchaValue,
        });
    };

    const registerUser = ({ user_type, username, email, password }) => {
        let bodyFormData = new FormData();
        bodyFormData.set('user_type', user_type);
        bodyFormData.set('username', username);
        bodyFormData.set('email', email);
        bodyFormData.set('password', password);
        axios({
            method: 'post',
            url: '/api/admin/manage-users/users/create',
            data: bodyFormData,
            auth: {
                username: props.auth.token,
            },
            headers: { 'Content-Type': 'multipart/form-data' },
        })
            .then((response) => {
                setIsSendingForm(false);
                setSendingFormFinished(true);
                toast('Successfully created user');
            })
            .catch((error) => {
                setErrorMsg(error.response?.data?.message);
                setIsSendingForm(false);
                setSendingFormFinished(true);
            });
    };

    const loadingContent = (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <CircularProgress />
        </div>
    );

    return (
        <Dialog
            open={props.show}
            onClose={props.onClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>Create User</DialogTitle>
            <DialogContent>
                <Container>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                {/* User Type */}
                                <FormControl fullWidth margin="normal">
                                    <InputLabel id="user-type-label">User type</InputLabel>
                                    <Select
                                        labelId="user-type-label"
                                        id="user-type"
                                        value={selectedUserType}
                                        onChange={(e) => setSelectedUserType(e.target.value)}
                                    >
                                        {userTypes.map((item, key) => (
                                            <MenuItem key={key} value={item}>
                                                {item}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                {/* Username */}
                                <FormControl fullWidth margin="normal">
                                    <InputLabel htmlFor="username">Username</InputLabel>
                                    <Input
                                        id="username"
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <AccountCircle />
                                            </InputAdornment>
                                        }
                                        {...control.register('username')}
                                    />
                                    <Typography color="error">
                                        {errors.username?.message}
                                    </Typography>
                                </FormControl>
                                {/* Email */}
                                <FormControl fullWidth margin="normal">
                                    <InputLabel htmlFor="email">Email</InputLabel>
                                    <Input
                                        id="email"
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <Email />
                                            </InputAdornment>
                                        }
                                        {...control.register('email')}
                                    />
                                    <Typography color="error">
                                        {errors.email?.message}
                                    </Typography>
                                </FormControl>
                                {/* Password */}
                                <FormControl fullWidth margin="normal">
                                    <InputLabel htmlFor="password">Password</InputLabel>
                                    <Input
                                        id="password"
                                        type="password"
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <Lock />
                                            </InputAdornment>
                                        }
                                        {...control.register('password')}
                                    />
                                    <Typography color="error">
                                        {errors.password?.message}
                                    </Typography>
                                </FormControl>
                                {/* Confirm Password */}
                                <FormControl fullWidth margin="normal">
                                    <InputLabel htmlFor="passwordConfirmation">Confirm Password</InputLabel>
                                    <Input
                                        id="passwordConfirmation"
                                        type="password"
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <Lock />
                                            </InputAdornment>
                                        }
                                        {...control.register('passwordConfirmation')}
                                    />
                                    <Typography color="error">
                                        {errors.passwordConfirmation?.message}
                                    </Typography>
                                </FormControl>
                                {errorMsg && (
                                    <Typography color="error">
                                        {errorMsg}
                                    </Typography>
                                )}
                                <Grid container spacing={2} justifyContent="flex-end">
                                    <Grid item>
                                        {isSendingForm && !sendingFormFinished ? (
                                            loadingContent
                                        ) : (
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                type="submit"
                                                onClick={() => setRegisterButtonFirstClicked(true)}
                                            >
                                                Register
                                            </Button>
                                        )}
                                    </Grid>
                                </Grid>
                            </form>
                        </Grid>
                    </Grid>
                </Container>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const mapStateToProps = (state) => {
    return {
        auth: state.auth,
        isAuthenticated: state.auth.token !== null,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onGetAuthStorage: () => dispatch(actions.getAuthStorage()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateUserModal);
