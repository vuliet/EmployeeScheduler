import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  Link,
  Container,
  Stack,
  MenuItem
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useAuth } from '../../hooks/useAuth';
import { RegisterTenantRequest } from '../../types/auth';
import { useNavigate } from 'react-router-dom';

const validationSchema = yup.object({
  tenantName: yup.string().required('Organization name is required'),
  domain: yup.string().required('Domain is required'),
  adminFirstName: yup.string().required('First name is required'),
  adminLastName: yup.string().required('Last name is required'),
  adminEmail: yup.string().email('Enter a valid email').required('Email is required'),
  adminPassword: yup.string().min(6, 'Password should be minimum 6 characters').required('Password is required'),
  timeZone: yup.string().required('Time zone is required'),
});

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const { register, isLoading } = useAuth();
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      tenantName: '',
      domain: '',
      adminFirstName: '',
      adminLastName: '',
      adminEmail: '',
      adminPassword: '',
      subscriptionType: 1, // Free
      timeZone: 'UTC',
      locale: 'en-US',
    },
    validationSchema,
    onSubmit: async (values: RegisterTenantRequest) => {
      try {
        setError('');
        await register(values);
        navigate('/dashboard');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Registration failed');
      }
    },
  });

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Employee Scheduler
          </Typography>
          <Typography component="h2" variant="h5" align="center" gutterBottom>
            Register Your Organization
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Organization Information
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  required
                  fullWidth
                  id="tenantName"
                  label="Organization Name"
                  name="tenantName"
                  value={formik.values.tenantName}
                  onChange={formik.handleChange}
                  error={formik.touched.tenantName && Boolean(formik.errors.tenantName)}
                  helperText={formik.touched.tenantName && formik.errors.tenantName}
                />
                <TextField
                  required
                  fullWidth
                  id="domain"
                  label="Domain"
                  name="domain"
                  value={formik.values.domain}
                  onChange={formik.handleChange}
                  error={formik.touched.domain && Boolean(formik.errors.domain)}
                  helperText={formik.touched.domain && formik.errors.domain}
                />
              </Box>
              <TextField
                select
                fullWidth
                id="timeZone"
                label="Time Zone"
                name="timeZone"
                value={formik.values.timeZone}
                onChange={formik.handleChange}
                error={formik.touched.timeZone && Boolean(formik.errors.timeZone)}
                helperText={formik.touched.timeZone && formik.errors.timeZone}
              >
                <MenuItem value="UTC">UTC</MenuItem>
                <MenuItem value="America/New_York">Eastern Time</MenuItem>
                <MenuItem value="America/Chicago">Central Time</MenuItem>
                <MenuItem value="America/Denver">Mountain Time</MenuItem>
                <MenuItem value="America/Los_Angeles">Pacific Time</MenuItem>
              </TextField>
            </Stack>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Administrator Account
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  required
                  fullWidth
                  id="adminFirstName"
                  label="First Name"
                  name="adminFirstName"
                  value={formik.values.adminFirstName}
                  onChange={formik.handleChange}
                  error={formik.touched.adminFirstName && Boolean(formik.errors.adminFirstName)}
                  helperText={formik.touched.adminFirstName && formik.errors.adminFirstName}
                />
                <TextField
                  required
                  fullWidth
                  id="adminLastName"
                  label="Last Name"
                  name="adminLastName"
                  value={formik.values.adminLastName}
                  onChange={formik.handleChange}
                  error={formik.touched.adminLastName && Boolean(formik.errors.adminLastName)}
                  helperText={formik.touched.adminLastName && formik.errors.adminLastName}
                />
              </Box>
              <TextField
                required
                fullWidth
                id="adminEmail"
                label="Email Address"
                name="adminEmail"
                autoComplete="email"
                value={formik.values.adminEmail}
                onChange={formik.handleChange}
                error={formik.touched.adminEmail && Boolean(formik.errors.adminEmail)}
                helperText={formik.touched.adminEmail && formik.errors.adminEmail}
              />
              <TextField
                required
                fullWidth
                name="adminPassword"
                label="Password"
                type="password"
                id="adminPassword"
                autoComplete="new-password"
                value={formik.values.adminPassword}
                onChange={formik.handleChange}
                error={formik.touched.adminPassword && Boolean(formik.errors.adminPassword)}
                helperText={formik.touched.adminPassword && formik.errors.adminPassword}
              />
            </Stack>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Organization Account'}
            </Button>
            <Box textAlign="center">
              <Link
                component="button"
                variant="body2"
                onClick={(e) => {
                  e.preventDefault();
                  onSwitchToLogin();
                }}
              >
                Already have an account? Sign In
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterForm;