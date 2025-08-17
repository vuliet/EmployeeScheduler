import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Chip,
  Alert,
  CircularProgress,
  Fab
} from '@mui/material';
import {
  ArrowBack,
  Add,
  Publish,
} from '@mui/icons-material';
import { 
  Schedule, 
  ScheduleStatus, 
  Shift, 
  ShiftStatus,
  scheduleService 
} from '../services/scheduleService';
import { shiftService, CreateShift } from '../services/shiftService';
import ShiftCard from '../components/schedule/ShiftCard';
import ShiftDialog from '../components/schedule/ShiftDialog';

const ScheduleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shiftDialogOpen, setShiftDialogOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);

  useEffect(() => {
    if (id) {
      loadScheduleData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadScheduleData = async () => {
    try {
      setLoading(true);
      if (!id) return;
      
      const [scheduleData, shiftsData] = await Promise.all([
        scheduleService.getById(id),
        shiftService.getAll(id)
      ]);
      
      setSchedule(scheduleData);
      setShifts(shiftsData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load schedule data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddShift = () => {
    setEditingShift(null);
    setShiftDialogOpen(true);
  };

  const handleEditShift = (shift: Shift) => {
    setEditingShift(shift);
    setShiftDialogOpen(true);
  };

  const handleDeleteShift = async (shift: Shift) => {
    if (window.confirm('Are you sure you want to delete this shift?')) {
      try {
        await shiftService.delete(shift.id);
        await loadScheduleData();
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete shift');
      }
    }
  };

  const handleShiftStatusChange = async (shift: Shift, status: ShiftStatus) => {
    try {
      await shiftService.updateStatus(shift.id, status);
      await loadScheduleData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update shift status');
    }
  };

  const handleSaveShift = async (shiftData: CreateShift) => {
    try {
      if (editingShift) {
        await shiftService.update(editingShift.id, shiftData);
      } else {
        await shiftService.create(shiftData);
      }
      await loadScheduleData();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to save shift');
    }
  };

  const handlePublishSchedule = async () => {
    if (!schedule) return;
    
    try {
      await scheduleService.publish(schedule.id);
      await loadScheduleData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to publish schedule');
    }
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

  // Group shifts by date
  const shiftsByDate = shifts.reduce((acc, shift) => {
    const date = new Date(shift.date).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(shift);
    return acc;
  }, {} as Record<string, Shift[]>);

  const sortedDates = Object.keys(shiftsByDate).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!schedule) {
    return (
      <Box>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/schedules')}>
          Back to Schedules
        </Button>
        <Typography variant="h6" color="error" sx={{ mt: 2 }}>
          Schedule not found
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Button startIcon={<ArrowBack />} onClick={() => navigate('/schedules')}>
            Back
          </Button>
          <Typography variant="h4">
            Schedule Details
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          {schedule.status === ScheduleStatus.Draft && (
            <Button
              variant="outlined"
              startIcon={<Publish />}
              onClick={handlePublishSchedule}
              color="success"
            >
              Publish Schedule
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddShift}
          >
            Add Shift
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        <Box sx={{ flex: '1 1 300px', maxWidth: 400 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Schedule Information
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Week Period
              </Typography>
              <Typography variant="body1" gutterBottom>
                {new Date(schedule.weekStart).toLocaleDateString()} - {new Date(schedule.weekEnd).toLocaleDateString()}
              </Typography>
              
              <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                Status
              </Typography>
              <Chip
                label={getStatusLabel(schedule.status)}
                color={getStatusColor(schedule.status)}
                sx={{ mb: 2 }}
              />
              
              <Typography variant="body2" color="textSecondary">
                Total Shifts
              </Typography>
              <Typography variant="h4" color="primary" gutterBottom>
                {shifts.length}
              </Typography>
              
              {schedule.notes && (
                <>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                    Notes
                  </Typography>
                  <Typography variant="body1">
                    {schedule.notes}
                  </Typography>
                </>
              )}
            </Box>
          </Paper>
        </Box>

        <Box sx={{ flex: '2 1 600px' }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Shifts
            </Typography>
            {shifts.length === 0 ? (
              <Box textAlign="center" py={4}>
                <Typography color="textSecondary" gutterBottom>
                  No shifts scheduled yet
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={handleAddShift}
                >
                  Add First Shift
                </Button>
              </Box>
            ) : (
              sortedDates.map(date => (
                <Box key={date} mb={3}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    {new Date(date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </Typography>
                  {shiftsByDate[date]
                    .sort((a, b) => a.startTime.localeCompare(b.startTime))
                    .map(shift => (
                      <ShiftCard
                        key={shift.id}
                        shift={shift}
                        onEdit={handleEditShift}
                        onDelete={handleDeleteShift}
                        onStatusChange={handleShiftStatusChange}
                      />
                    ))}
                </Box>
              ))
            )}
          </Paper>
        </Box>
      </Box>

      <Fab
        color="primary"
        aria-label="add shift"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={handleAddShift}
      >
        <Add />
      </Fab>

      {schedule && (
        <ShiftDialog
          open={shiftDialogOpen}
          onClose={() => setShiftDialogOpen(false)}
          onSubmit={handleSaveShift}
          scheduleId={schedule.id}
          shift={editingShift || undefined}
          weekStart={schedule.weekStart}
          weekEnd={schedule.weekEnd}
        />
      )}
    </Box>
  );
};

export default ScheduleDetailPage;