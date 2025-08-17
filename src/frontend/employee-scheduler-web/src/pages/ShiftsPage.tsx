import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Alert,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  TextField,
  Stack,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import {
  MoreVert,
  Add,
  Schedule as ScheduleIcon,
  Person,
  AccessTime,
  CalendarToday,
  FilterList
} from '@mui/icons-material';
import { Shift, ShiftStatus, ShiftType, Schedule as ScheduleType } from '../services/scheduleService';
import { shiftService, CreateShift } from '../services/shiftService';
import { employeeService, Employee } from '../services/employeeService';
import { scheduleService } from '../services/scheduleService';

const ShiftsPage: React.FC = () => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [schedules, setSchedules] = useState<ScheduleType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ShiftStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<ShiftType | 'all'>('all');
  const [dateFilter, setDateFilter] = useState('');
  const [newShift, setNewShift] = useState<CreateShift>({
    scheduleId: '',
    employeeId: '',
    date: '',
    startTime: '',
    endTime: '',
    shiftType: ShiftType.Morning,
    notes: '',
    isOvertime: false
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [shiftsData, employeesData, schedulesData] = await Promise.all([
        shiftService.getAll().catch(() => []),
        employeeService.getAll().catch(() => []),
        scheduleService.getAll().catch(() => [])
      ]);
      setShifts(shiftsData || []);
      setEmployees(employeesData || []);
      setSchedules(schedulesData || []);
    } catch (err: any) {
      setError('Failed to load data: ' + (err.message || 'Unknown error'));
      console.error('Shifts page error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadShifts = async () => {
    try {
      const shiftsData = await shiftService.getAll();
      setShifts(shiftsData);
    } catch (err: any) {
      setError('Failed to load shifts');
      console.error(err);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, shift: Shift) => {
    setAnchorEl(event.currentTarget);
    setSelectedShift(shift);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedShift(null);
  };

  const handleStatusUpdate = async (status: ShiftStatus) => {
    if (!selectedShift) return;
    
    try {
      await shiftService.updateStatus(selectedShift.id, status);
      await loadShifts();
      handleMenuClose();
    } catch (err) {
      setError('Failed to update shift status');
    }
  };

  const handleCreateShift = async () => {
    let shiftPayload: any = null;
    
    try {
      setLoading(true);
      
      // Validation
      if (!newShift.scheduleId || !newShift.employeeId || !newShift.date || !newShift.startTime || !newShift.endTime) {
        setError('Please fill in all required fields');
        return;
      }

      // Validate that we have schedules and employees loaded
      if (schedules.length === 0) {
        setError('No schedules available. Please create a schedule first.');
        return;
      }

      if (employees.length === 0) {
        setError('No employees available. Please add employees first.');
        return;
      }

      // Check if start time is before end time
      if (newShift.startTime >= newShift.endTime) {
        setError('Start time must be before end time');
        return;
      }

      // Validate GUID format
      const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!guidRegex.test(newShift.scheduleId)) {
        setError('Invalid schedule selected');
        return;
      }
      if (!guidRegex.test(newShift.employeeId)) {
        setError('Invalid employee selected');
        return;
      }

      // Convert time strings to TimeSpan format (HH:mm:ss)
      const startTimeSpan = `${newShift.startTime}:00`;
      const endTimeSpan = `${newShift.endTime}:00`;
      
      // Create the payload with proper formatting
      shiftPayload = {
        scheduleId: newShift.scheduleId,
        employeeId: newShift.employeeId,
        date: new Date(newShift.date).toISOString(),
        startTime: startTimeSpan,
        endTime: endTimeSpan,
        shiftType: newShift.shiftType,
        notes: newShift.notes || '',
        isOvertime: newShift.isOvertime
      };
      
      console.log('Creating shift with payload:', shiftPayload);
      await shiftService.create(shiftPayload);
      
      setCreateDialogOpen(false);
      setNewShift({
        scheduleId: '',
        employeeId: '',
        date: '',
        startTime: '',
        endTime: '',
        shiftType: ShiftType.Morning,
        notes: '',
        isOvertime: false
      });
      await loadShifts();
      setError(''); // Clear any previous errors
    } catch (err: any) {
      console.error('Create shift error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        payload: shiftPayload
      });
      
      const errorMessage = err.response?.data?.message || err.response?.data || err.message || 'Failed to create shift';
      setError(`Failed to create shift: ${JSON.stringify(errorMessage)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateDialog = () => {
    console.log('Opening create dialog. Available data:', {
      schedules: schedules.length,
      employees: employees.length,
      schedulesList: schedules,
      employeesList: employees
    });
    
    const today = new Date().toISOString().split('T')[0];
    setNewShift({
      ...newShift,
      date: today,
      startTime: '09:00',
      endTime: '17:00'
    });
    setCreateDialogOpen(true);
  };

  const getStatusColor = (status: ShiftStatus): 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' => {
    switch (status) {
      case ShiftStatus.Scheduled: return 'primary';
      case ShiftStatus.InProgress: return 'warning';
      case ShiftStatus.Completed: return 'success';
      case ShiftStatus.Cancelled: return 'error';
      case ShiftStatus.NoShow: return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: ShiftStatus): string => {
    switch (status) {
      case ShiftStatus.Scheduled: return 'Scheduled';
      case ShiftStatus.InProgress: return 'In Progress';
      case ShiftStatus.Completed: return 'Completed';
      case ShiftStatus.Cancelled: return 'Cancelled';
      case ShiftStatus.NoShow: return 'No Show';
      default: return 'Unknown';
    }
  };

  const getShiftTypeText = (type: ShiftType): string => {
    switch (type) {
      case ShiftType.Morning: return 'Morning';
      case ShiftType.Afternoon: return 'Afternoon';
      case ShiftType.Evening: return 'Evening';
      case ShiftType.Night: return 'Night';
      default: return 'Unknown';
    }
  };

  const filteredShifts = shifts.filter(shift => {
    if (statusFilter !== 'all' && shift.status !== statusFilter) return false;
    if (typeFilter !== 'all' && shift.shiftType !== typeFilter) return false;
    if (dateFilter && !shift.date.includes(dateFilter)) return false;
    return true;
  });

  // Calculate statistics
  const totalShifts = filteredShifts.length;
  const completedShifts = filteredShifts.filter(s => s.status === ShiftStatus.Completed).length;
  const inProgressShifts = filteredShifts.filter(s => s.status === ShiftStatus.InProgress).length;
  const todayShifts = filteredShifts.filter(s => {
    const today = new Date().toISOString().split('T')[0];
    return s.date.split('T')[0] === today;
  }).length;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Shifts Management
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpenCreateDialog}
          >
            Create Shift
          </Button>
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => setFilterDialogOpen(true)}
          >
            Filter
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
        <Box sx={{ flex: '1 1 250px' }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <ScheduleIcon color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">{totalShifts}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total Shifts
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 250px' }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CalendarToday color="warning" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">{todayShifts}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Today's Shifts
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 250px' }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <AccessTime color="info" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">{inProgressShifts}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    In Progress
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 250px' }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Person color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">{completedShifts}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Completed
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Shifts Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Overtime</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredShifts.map((shift) => (
                <TableRow key={shift.id}>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2">
                        {shift.employeeName}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {shift.employeeCode}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {new Date(shift.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {shift.startTime} - {shift.endTime}
                  </TableCell>
                  <TableCell>
                    {getShiftTypeText(shift.shiftType)}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusText(shift.status)}
                      color={getStatusColor(shift.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {shift.isOvertime ? (
                      <Chip label="Yes" color="warning" size="small" />
                    ) : (
                      <Chip label="No" color="default" size="small" />
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={(e) => handleMenuOpen(e, shift)}
                      size="small"
                    >
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {filteredShifts.length === 0 && !loading && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="textSecondary">
            No shifts found
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Shifts are created through schedule management.
          </Typography>
        </Box>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleStatusUpdate(ShiftStatus.InProgress)}>
          Mark In Progress
        </MenuItem>
        <MenuItem onClick={() => handleStatusUpdate(ShiftStatus.Completed)}>
          Mark Completed
        </MenuItem>
        <MenuItem onClick={() => handleStatusUpdate(ShiftStatus.Cancelled)}>
          Mark Cancelled
        </MenuItem>
        <MenuItem onClick={() => handleStatusUpdate(ShiftStatus.NoShow)}>
          Mark No Show
        </MenuItem>
      </Menu>

      {/* Filter Dialog */}
      <Dialog open={filterDialogOpen} onClose={() => setFilterDialogOpen(false)}>
        <DialogTitle>Filter Shifts</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1, minWidth: 300 }}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value as ShiftStatus | 'all')}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value={ShiftStatus.Scheduled}>Scheduled</MenuItem>
                <MenuItem value={ShiftStatus.InProgress}>In Progress</MenuItem>
                <MenuItem value={ShiftStatus.Completed}>Completed</MenuItem>
                <MenuItem value={ShiftStatus.Cancelled}>Cancelled</MenuItem>
                <MenuItem value={ShiftStatus.NoShow}>No Show</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={typeFilter}
                label="Type"
                onChange={(e) => setTypeFilter(e.target.value as ShiftType | 'all')}
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value={ShiftType.Morning}>Morning</MenuItem>
                <MenuItem value={ShiftType.Afternoon}>Afternoon</MenuItem>
                <MenuItem value={ShiftType.Evening}>Evening</MenuItem>
                <MenuItem value={ShiftType.Night}>Night</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Date (YYYY-MM-DD)"
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFilterDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              setStatusFilter('all');
              setTypeFilter('all');
              setDateFilter('');
              setFilterDialogOpen(false);
            }}
          >
            Clear Filters
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Shift Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Shift</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Schedule</InputLabel>
              <Select
                value={newShift.scheduleId}
                label="Schedule"
                onChange={(e) => setNewShift({ ...newShift, scheduleId: e.target.value })}
              >
                {schedules.length === 0 ? (
                  <MenuItem disabled>No schedules available - create a schedule first</MenuItem>
                ) : (
                  schedules.map((schedule) => (
                    <MenuItem key={schedule.id} value={schedule.id}>
                      {new Date(schedule.weekStart).toLocaleDateString()} - {new Date(schedule.weekEnd).toLocaleDateString()}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Employee</InputLabel>
              <Select
                value={newShift.employeeId}
                label="Employee"
                onChange={(e) => setNewShift({ ...newShift, employeeId: e.target.value })}
              >
                {employees.length === 0 ? (
                  <MenuItem disabled>No employees available - add employees first</MenuItem>
                ) : (
                  employees.map((employee) => (
                    <MenuItem key={employee.id} value={employee.id}>
                      {employee.firstName} {employee.lastName} ({employee.employeeCode})
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>

            <TextField
              label="Date"
              type="date"
              value={newShift.date}
              onChange={(e) => setNewShift({ ...newShift, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />

            <Box display="flex" gap={2}>
              <TextField
                label="Start Time"
                type="time"
                value={newShift.startTime}
                onChange={(e) => setNewShift({ ...newShift, startTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                label="End Time"
                type="time"
                value={newShift.endTime}
                onChange={(e) => setNewShift({ ...newShift, endTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Box>

            <FormControl fullWidth>
              <InputLabel>Shift Type</InputLabel>
              <Select
                value={newShift.shiftType}
                label="Shift Type"
                onChange={(e) => setNewShift({ ...newShift, shiftType: e.target.value as ShiftType })}
              >
                <MenuItem value={ShiftType.Morning}>Morning</MenuItem>
                <MenuItem value={ShiftType.Afternoon}>Afternoon</MenuItem>
                <MenuItem value={ShiftType.Evening}>Evening</MenuItem>
                <MenuItem value={ShiftType.Night}>Night</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Notes"
              multiline
              rows={3}
              value={newShift.notes}
              onChange={(e) => setNewShift({ ...newShift, notes: e.target.value })}
              fullWidth
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={newShift.isOvertime}
                  onChange={(e) => setNewShift({ ...newShift, isOvertime: e.target.checked })}
                />
              }
              label="Mark as overtime"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreateShift}
            variant="contained"
            disabled={
              !newShift.scheduleId || 
              !newShift.employeeId || 
              !newShift.date || 
              !newShift.startTime || 
              !newShift.endTime ||
              loading
            }
          >
            {loading ? 'Creating...' : 'Create Shift'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ShiftsPage;