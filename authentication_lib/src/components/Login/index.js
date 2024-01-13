import * as React from 'react'
import * as yup from 'yup';
import { useFormik } from 'formik';
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom';
import { post } from '../../utils/apiHelper';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Rectangle Technologies
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

export default function LoginPage() {
  const navigate = useNavigate();

  const handleSubmitOld = (event) => {
    event.preventDefault()
    navigate('/dashboard/user_management', { replace: false });
  }

  React.useEffect(() => {
    var userDetails = localStorage.getItem("userauthdetails") ? JSON.parse(localStorage.getItem("userauthdetails")) : null;

    const token = userDetails?.token;

    if (token) {
    navigate('/dashboard/user_management', { replace: false });
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
      post('http://localhost:4000/api/user/login', null, values)
        .then((response) => {
          if (response?.data?.data) {
            // set token expiry to 1 day
            response.data.data.tokenExpiry = new Date().getTime() + 86400000;
          }
          // store token in local storage
          localStorage.setItem('userauthdetails', JSON.stringify(response?.data?.data));
          actions.setSubmitting(false);

          navigate('/dashboard/user_management', { replace: false });
  }
        ).catch((error) => {
          alert(error?.response?.data?.message || 'Invalid Credentials');
          actions.setSubmitting(false);
        });
    }
  });

  const { handleSubmit, handleChange, values, errors, touched, isSubmitting } = formik;


  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={false}
        md={7}
        sx={{
          backgroundImage: 'url(https://source.unsplash.com/random)',
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) => {
            return t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900]
          },
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={0} square margin={"auto"}>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email"
              value={values.email}
              onChange={handleChange}
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              autoFocus
              margin='normal'
            />
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
              autoFocus
              margin='normal'
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
                            disabled={isSubmitting}
                            type="submit"
              fullWidth
              variant="contained"
                            onClick={handleSubmit}
                            sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
            <Copyright sx={{ mt: 5 }} />
          </Box>
        </Box>
      </Grid>
    </Grid>
  )
}