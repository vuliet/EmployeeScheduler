import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  Stack
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Person,
  Email,
  Phone,
  Business
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { employeeService, Employee, CreateEmployee } from '../services/employeeService';

const validationSchema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  employeeCode: yup.string().required('Employee code is required'),
  department: yup.string().required('Department is required'),
  position: yup.string().required('Position is required'),
  hireDate: yup.date().required('Hire date is required'),
  phoneNumber: yup.string().required('Phone number is required'),
  address: yup.string().required('Address is required'),
  role: yup.number().required('Role is required')
});

const EmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getAll();
      setEmployees(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      employeeCode: '',
      department: '',
      position: '',
      hireDate: new Date().toISOString().split('T')[0],
      phoneNumber: '',
      address: '',
      role: 3 // Employee
    },
    validationSchema,
    onSubmit: async (values: CreateEmployee) => {
      try {
        if (editingEmployee) {
          await employeeService.update(editingEmployee.id, values);
        } else {
          await employeeService.create(values);
        }
        setOpenDialog(false);
        setEditingEmployee(null);
        formik.resetForm();
        await loadEmployees();
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to save employee');
      }
    }
  });

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    formik.setValues({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      employeeCode: employee.employeeCode,
      department: employee.department,
      position: employee.position,
      hireDate: employee.hireDate.split('T')[0],
      phoneNumber: employee.phoneNumber,
      address: employee.address,
      role: 3 // Default to employee role
    });
    setOpenDialog(true);
  };

  const handleDelete = async (employee: Employee) => {
    if (window.confirm(`Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`)) {
      try {
        await employeeService.delete(employee.id);
        await loadEmployees();
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete employee');
      }
    }
  };

  const handleAddNew = () => {
    setEditingEmployee(null);
    formik.resetForm();
    setOpenDialog(true);
  };


  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading employees...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Employees
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddNew}
        >
          Add Employee
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Stack direction="row" spacing={2} mb={3}>
        <Card sx={{ minWidth: 200 }}>
          <CardContent>
            <Box display="flex" alignItems="center">
              <Person color="primary" sx={{ mr: 2 }} />
              <Box>
                <Typography variant="h6">{employees.length}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Total Employees
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200 }}>
          <CardContent>
            <Box display="flex" alignItems="center">
              <Business color="success" sx={{ mr: 2 }} />
              <Box>
                <Typography variant="h6">
                  {new Set(employees.map(e => e.department)).size}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Departments
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Stack>

      {/* Employee Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Employee Code</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Hire Date</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography color="textSecondary">
                    No employees found. Click "Add Employee" to get started.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Person sx={{ mr: 1, color: 'text.secondary' }} />
                      {employee.firstName} {employee.lastName}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Email sx={{ mr: 1, color: 'text.secondary' }} />
                      {employee.email}
                    </Box>
                  </TableCell>
                  <TableCell>{employee.employeeCode}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>
                    {new Date(employee.hireDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                      {employee.phoneNumber}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(employee)}
                      color="primary"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(employee)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Employee Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
        </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Box display="flex" gap={2}>
                <TextField
                  fullWidth
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                  helperText={formik.touched.firstName && formik.errors.firstName}
                />
                <TextField
                  fullWidth
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                  helperText={formik.touched.lastName && formik.errors.lastName}
                />
              </Box>

              <Box display="flex" gap={2}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email Address"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
                <TextField
                  fullWidth
                  id="employeeCode"
                  name="employeeCode"
                  label="Employee Code"
                  value={formik.values.employeeCode}
                  onChange={formik.handleChange}
                  error={formik.touched.employeeCode && Boolean(formik.errors.employeeCode)}
                  helperText={formik.touched.employeeCode && formik.errors.employeeCode}
                />
              </Box>

              <Box display="flex" gap={2}>
                <TextField
                  fullWidth
                  id="department"
                  name="department"
                  label="Department"
                  value={formik.values.department}
                  onChange={formik.handleChange}
                  error={formik.touched.department && Boolean(formik.errors.department)}
                  helperText={formik.touched.department && formik.errors.department}
                />
                <TextField
                  fullWidth
                  id="position"
                  name="position"
                  label="Position"
                  value={formik.values.position}
                  onChange={formik.handleChange}
                  error={formik.touched.position && Boolean(formik.errors.position)}
                  helperText={formik.touched.position && formik.errors.position}
                />
              </Box>

              <Box display="flex" gap={2}>
                <TextField
                  fullWidth
                  id="hireDate"
                  name="hireDate"
                  label="Hire Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={formik.values.hireDate}
                  onChange={formik.handleChange}
                  error={formik.touched.hireDate && Boolean(formik.errors.hireDate)}
                  helperText={formik.touched.hireDate && formik.errors.hireDate}
                />
                <TextField
                  select
                  fullWidth
                  id="role"
                  name="role"
                  label="Role"
                  value={formik.values.role}
                  onChange={formik.handleChange}
                  error={formik.touched.role && Boolean(formik.errors.role)}
                  helperText={formik.touched.role && formik.errors.role}
                >
                  <MenuItem value={1}>Admin</MenuItem>
                  <MenuItem value={2}>Manager</MenuItem>
                  <MenuItem value={3}>Employee</MenuItem>
                </TextField>
              </Box>

              <TextField
                fullWidth
                id="phoneNumber"
                name="phoneNumber"
                label="Phone Number"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
              />

              <TextField
                fullWidth
                id="address"
                name="address"
                label="Address"
                multiline
                rows={2}
                value={formik.values.address}
                onChange={formik.handleChange}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingEmployee ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default EmployeesPage;