import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  FormControlLabel,
  Checkbox,
  Alert,
  Stack
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Shift, ShiftType } from '../../services/scheduleService';
import { CreateShift } from '../../services/shiftService';
import { Employee, employeeService } from '../../services/employeeService';

const validationSchema = yup.object({
  employeeId: yup.string().required('Employee is required'),
  date: yup.date().required('Date is required'),
  startTime: yup.string().required('Start time is required'),
  endTime: yup.string().required('End time is required'),
  shiftType: yup.number().required('Shift type is required'),
  notes: yup.string(),
  isOvertime: yup.boolean()
});

interface ShiftDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (shift: CreateShift) => Promise<void>;
  scheduleId: string;
  shift?: Shift;
  weekStart: string;
  weekEnd: string;
}

const ShiftDialog: React.FC<ShiftDialogProps> = ({
  open,
  onClose,
  onSubmit,
  scheduleId,
  shift,
  weekStart,
  weekEnd
}) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      loadEmployees();
    }
  }, [open]);

  const loadEmployees = async () => {
    try {
      const data = await employeeService.getAll();
      setEmployees(data);
    } catch (err: any) {
      setError('Failed to load employees');
    }
  };

  const formik = useFormik({
    initialValues: {
      employeeId: shift?.employeeId || '',
      date: shift?.date?.split('T')[0] || new Date().toISOString().split('T')[0],
      startTime: shift?.startTime || '09:00',
      endTime: shift?.endTime || '17:00',
      shiftType: shift?.shiftType || ShiftType.Morning,
      notes: shift?.notes || '',
      isOvertime: shift?.isOvertime || false
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError('');
        
        const shiftData: CreateShift = {
          scheduleId,
          employeeId: values.employeeId,
          date: values.date,
          startTime: values.startTime,
          endTime: values.endTime,
          shiftType: values.shiftType,
          notes: values.notes,
          isOvertime: values.isOvertime
        };
        
        await onSubmit(shiftData);
        onClose();
        formik.resetForm();
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to save shift');
      } finally {
        setLoading(false);
      }
    }
  });

  const handleClose = () => {
    onClose();
    formik.resetForm();
    setError('');
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {shift ? 'Edit Shift' : 'Add New Shift'}
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              select
              fullWidth
              id="employeeId"
              name="employeeId"
              label="Employee"
              value={formik.values.employeeId}
              onChange={formik.handleChange}
              error={formik.touched.employeeId && Boolean(formik.errors.employeeId)}
              helperText={formik.touched.employeeId && formik.errors.employeeId}
            >
              {employees.map((employee) => (
                <MenuItem key={employee.id} value={employee.id}>
                  {employee.firstName} {employee.lastName} ({employee.employeeCode})
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              id="date"
              name="date"
              label="Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formik.values.date}
              onChange={formik.handleChange}
              error={formik.touched.date && Boolean(formik.errors.date)}
              helperText={formik.touched.date && formik.errors.date}
              inputProps={{
                min: weekStart.split('T')[0],
                max: weekEnd.split('T')[0]
              }}
            />

            <Box display="flex" gap={2}>
              <TextField
                fullWidth
                id="startTime"
                name="startTime"
                label="Start Time"
                type="time"
                InputLabelProps={{ shrink: true }}
                value={formik.values.startTime}
                onChange={formik.handleChange}
                error={formik.touched.startTime && Boolean(formik.errors.startTime)}
                helperText={formik.touched.startTime && formik.errors.startTime}
              />
              <TextField
                fullWidth
                id="endTime"
                name="endTime"
                label="End Time"
                type="time"
                InputLabelProps={{ shrink: true }}
                value={formik.values.endTime}
                onChange={formik.handleChange}
                error={formik.touched.endTime && Boolean(formik.errors.endTime)}
                helperText={formik.touched.endTime && formik.errors.endTime}
              />
            </Box>

            <TextField
              select
              fullWidth
              id="shiftType"
              name="shiftType"
              label="Shift Type"
              value={formik.values.shiftType}
              onChange={formik.handleChange}
              error={formik.touched.shiftType && Boolean(formik.errors.shiftType)}
              helperText={formik.touched.shiftType && formik.errors.shiftType}
            >
              <MenuItem value={ShiftType.Morning}>Morning</MenuItem>
              <MenuItem value={ShiftType.Afternoon}>Afternoon</MenuItem>
              <MenuItem value={ShiftType.Evening}>Evening</MenuItem>
              <MenuItem value={ShiftType.Night}>Night</MenuItem>
            </TextField>

            <TextField
              fullWidth
              id="notes"
              name="notes"
              label="Notes"
              multiline
              rows={2}
              value={formik.values.notes}
              onChange={formik.handleChange}
              error={formik.touched.notes && Boolean(formik.errors.notes)}
              helperText={formik.touched.notes && formik.errors.notes}
            />

            <FormControlLabel
              control={
                <Checkbox
                  id="isOvertime"
                  name="isOvertime"
                  checked={formik.values.isOvertime}
                  onChange={formik.handleChange}
                />
              }
              label="Overtime Shift"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Saving...' : (shift ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ShiftDialog;