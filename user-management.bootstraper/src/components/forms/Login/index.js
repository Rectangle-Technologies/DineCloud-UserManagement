import * as React from "react";
import * as yup from 'yup';
import { useFormik } from 'formik';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { get, post } from "../../../utils/apiHelper";

export default function LoginForm({ callBackIfLoggedIn }) {

    React.useEffect(() => {
        var userDetails = localStorage.getItem("userauthdetails") ? JSON.parse(localStorage.getItem("userauthdetails")) : null;
        
        const token = userDetails?.token;

        if (token) {
            callBackIfLoggedIn();
        }
    }, []);
    const yupValidationSchema = yup.object({
        email: yup
            .string('Enter your email')
            .email('Enter a valid email')
            .required('Email is required'),
        password: yup
            .string('Enter your password')
            .min(8, 'Password should be of minimum 8 characters length')
            .required('Password is required'),
    });

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: yupValidationSchema,
        onSubmit: (values, actions) => {
            post('http://localhost:4000/USER/login', null, values)
                .then((response) => {
                    console.log(response);
                    if (response?.data?.data) {
                        // set token expiry to 1 day
                        response.data.data.tokenExpiry = new Date().getTime() + 86400000;
                    }
                    // store token in local storage
                    localStorage.setItem('userauthdetails', JSON.stringify(response?.data?.data));
                    actions.setSubmitting(false);

                    callBackIfLoggedIn();
                }
                ).catch((error) => {
                    console.log(error);
                    alert(error?.response?.data?.message || 'Invalid Credentials');
                    actions.setSubmitting(false);
                });
        }
    });

    const { handleSubmit, handleChange, values, errors, touched, isSubmitting } = formik;

    return (
        <Paper style={{
            padding: '1rem',
            margin: '1rem',
        }} elevation={2}>
            <form onSubmit={handleSubmit}>
                <Typography
                    variant="h4"
                    gutterBottom
                    style={{
                        textAlign: 'center',
                    }}>
                    Login User
                </Typography>
                <Typography
                    variant="body2"
                    gutterBottom
                    color={errors.accountNumber ? 'error' : 'textSecondary'}
                    style={{
                        textAlign: 'center',
                    }}>
                    Your Personal Finance Manager
                </Typography>
                <Grid container spacing={2} mt={2}>
                    <Grid item xs={12}>
                        <TextField  
                            fullWidth
                            id="email"
                            name="email"
                            label="Email"
                            value={values.email}
                            onChange={handleChange}
                            error={touched.email && Boolean(errors.email)}
                            helperText={touched.email && errors.email}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            id="password"
                            name="password"
                            label="Password"
                            type="password"
                            value={values.password}
                            onChange={handleChange}
                            error={touched.password && Boolean(errors.password)}
                            helperText={touched.password && errors.password}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Button
                            disabled={isSubmitting}
                            type="submit"
                            fullWidth
                            variant="contained"
                            onClick={handleSubmit}
                        >
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    )
};
