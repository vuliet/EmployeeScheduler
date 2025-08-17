import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Alert,
  Stack,
  Chip
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Publish,
  Schedule as ScheduleIcon,
  CalendarToday,
  Visibility
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { scheduleService, Schedule, CreateSchedule, ScheduleStatus } from '../services/scheduleService';

const validationSchema = yup.object({
  weekStart: yup.date().required('Week start is required'),
  weekEnd: yup.date().required('Week end is required'),
  notes: yup.string()
});

const SchedulesPage: React.FC = () => {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);

  const loadSchedules = async () => {
    try {
      setLoading(true);
      const data = await scheduleService.getAll();
      setSchedules(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load schedules');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchedules();
  }, []);

  const formik = useFormik({
    initialValues: {
      weekStart: '',
      weekEnd: '',
      notes: ''
    },
    validationSchema,
    onSubmit: async (values: CreateSchedule) => {
      try {
        if (editingSchedule) {
          await scheduleService.update(editingSchedule.id, values);
        } else {
          await scheduleService.create(values);
        }
        setOpenDialog(false);
        setEditingSchedule(null);
        formik.resetForm();
        await loadSchedules();
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to save schedule');
      }
    }
  });

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    formik.setValues({
      weekStart: schedule.weekStart.split('T')[0],
      weekEnd: schedule.weekEnd.split('T')[0],
      notes: schedule.notes
    });
    setOpenDialog(true);
  };

  const handleDelete = async (schedule: Schedule) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      try {
        await scheduleService.delete(schedule.id);
        await loadSchedules();
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete schedule');
      }
    }
  };

  const handlePublish = async (schedule: Schedule) => {
    try {
      await scheduleService.publish(schedule.id);
      await loadSchedules();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to publish schedule');
    }
  };

  const handleAddNew = () => {
    setEditingSchedule(null);
    // Default to current week
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
    
    formik.setValues({
      weekStart: startOfWeek.toISOString().split('T')[0],
      weekEnd: endOfWeek.toISOString().split('T')[0],
      notes: ''
    });
    setOpenDialog(true);
  };

  const getStatusColor = (status: ScheduleStatus) => {
    switch (status) {
      case ScheduleStatus.Draft: return 'warning';
      case ScheduleStatus.Published: return 'success';
      case ScheduleStatus.Archived: return 'default';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: ScheduleStatus) => {
    switch (status) {
      case ScheduleStatus.Draft: return 'Draft';
      case ScheduleStatus.Published: return 'Published';
      case ScheduleStatus.Archived: return 'Archived';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading schedules...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Schedules
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddNew}
        >
          Create Schedule
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
              <ScheduleIcon color="primary" sx={{ mr: 2 }} />
              <Box>
                <Typography variant="h6">{schedules.length}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Total Schedules
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200 }}>
          <CardContent>
            <Box display="flex" alignItems="center">
              <CalendarToday color="success" sx={{ mr: 2 }} />
              <Box>
                <Typography variant="h6">
                  {schedules.filter(s => s.status === ScheduleStatus.Published).length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Published
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200 }}>
          <CardContent>
            <Box display="flex" alignItems="center">
              <Edit color="warning" sx={{ mr: 2 }} />
              <Box>
                <Typography variant="h6">
                  {schedules.filter(s => s.status === ScheduleStatus.Draft).length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Drafts
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Stack>

      {/* Schedule Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Week Period</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Shifts</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schedules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="textSecondary">
                    No schedules found. Click "Create Schedule" to get started.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              schedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell>
                    {new Date(schedule.weekStart).toLocaleDateString()} - {new Date(schedule.weekEnd).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(schedule.status)}
                      color={getStatusColor(schedule.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{schedule.shifts?.length || 0}</TableCell>
                  <TableCell>{schedule.notes || '-'}</TableCell>
                  <TableCell>
                    {new Date(schedule.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/schedules/${schedule.id}`)}
                      color="primary"
                      title="View Details"
                    >
                      <Visibility />
                    </IconButton>
                    {schedule.status === ScheduleStatus.Draft && (
                      <IconButton
                        size="small"
                        onClick={() => handlePublish(schedule)}
                        color="success"
                        title="Publish Schedule"
                      >
                        <Publish />
                      </IconButton>
                    )}
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(schedule)}
                      color="primary"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(schedule)}
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

      {/* Add/Edit Schedule Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingSchedule ? 'Edit Schedule' : 'Create New Schedule'}
        </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Box display="flex" gap={2}>
                <TextField
                  fullWidth
                  id="weekStart"
                  name="weekStart"
                  label="Week Start"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={formik.values.weekStart}
                  onChange={formik.handleChange}
                  error={formik.touched.weekStart && Boolean(formik.errors.weekStart)}
                  helperText={formik.touched.weekStart && formik.errors.weekStart}
                />
                <TextField
                  fullWidth
                  id="weekEnd"
                  name="weekEnd"
                  label="Week End"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={formik.values.weekEnd}
                  onChange={formik.handleChange}
                  error={formik.touched.weekEnd && Boolean(formik.errors.weekEnd)}
                  helperText={formik.touched.weekEnd && formik.errors.weekEnd}
                />
              </Box>

              <TextField
                fullWidth
                id="notes"
                name="notes"
                label="Notes"
                multiline
                rows={3}
                value={formik.values.notes}
                onChange={formik.handleChange}
                error={formik.touched.notes && Boolean(formik.errors.notes)}
                helperText={formik.touched.notes && formik.errors.notes}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingSchedule ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default SchedulesPage;