import React, { useState, useEffect } from 'react';
import {
  Stack,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip
} from '@mui/material';
import {
  People,
  Schedule,
  Assignment,
  TrendingUp,
  Today,
  AccessTime
} from '@mui/icons-material';
import { employeeService } from '../services/employeeService';
import { scheduleService, ScheduleStatus } from '../services/scheduleService';
import { shiftService } from '../services/shiftService';

const DashboardPage: React.FC = () => {
  const [dashboardData, setDashboardData] = useState({
    totalEmployees: 0,
    activeSchedules: 0,
    shiftsThisWeek: 0,
    hoursThisWeek: 0
  });
  const [recentShifts, setRecentShifts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get current week date range
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const dayOfWeek = today.getDay();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - dayOfWeek);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      const [employees, schedules, weeklyShifts] = await Promise.all([
        employeeService.getAll().catch(() => []),
        scheduleService.getAll().catch(() => []),
        shiftService.getAll().catch(() => [])
      ]);

      // Calculate dashboard metrics
      const activeSchedules = schedules.filter(s => s.status === ScheduleStatus.Published).length;
      
      // Filter shifts for current week
      const currentWeekShifts = weeklyShifts.filter(shift => {
        try {
          const shiftDate = new Date(shift.date);
          return shiftDate >= startOfWeek && shiftDate <= endOfWeek;
        } catch {
          return false;
        }
      });

      // Calculate total hours
      const totalHours = currentWeekShifts.reduce((total, shift) => {
        try {
          const startTime = new Date(`2000-01-01T${shift.startTime}`);
          const endTime = new Date(`2000-01-01T${shift.endTime}`);
          const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
          return total + (isNaN(hours) ? 0 : hours);
        } catch {
          return total;
        }
      }, 0);

      setDashboardData({
        totalEmployees: employees.length || 0,
        activeSchedules: activeSchedules || 0,
        shiftsThisWeek: currentWeekShifts.length || 0,
        hoursThisWeek: Math.round(totalHours) || 0
      });

      // Get recent shifts (today and tomorrow)
      const recentShiftsData = weeklyShifts
        .filter(shift => {
          try {
            const shiftDate = new Date(shift.date);
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            return shiftDate >= new Date() && shiftDate <= tomorrow;
          } catch {
            return false;
          }
        })
        .sort((a, b) => {
          try {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          } catch {
            return 0;
          }
        })
        .slice(0, 5);

      setRecentShifts(recentShiftsData || []);
    } catch (err: any) {
      setError('Failed to load dashboard data: ' + (err.message || 'Unknown error'));
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Stack spacing={3}>
        {/* Stats Cards */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ flex: '1 1 250px' }}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <People color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h6">{dashboardData.totalEmployees}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Total Employees
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
                  <Schedule color="success" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h6">{dashboardData.activeSchedules}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Active Schedules
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
                  <Assignment color="warning" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h6">{dashboardData.shiftsThisWeek}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Shifts This Week
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
                  <TrendingUp color="error" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h6">{dashboardData.hoursThisWeek}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Hours This Week
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Content sections */}
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {/* Recent/Upcoming Shifts */}
          <Box sx={{ flex: '2 1 400px' }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Today & Tomorrow's Shifts
              </Typography>
              {recentShifts.length === 0 ? (
                <Typography variant="body2" color="textSecondary">
                  No upcoming shifts scheduled for today or tomorrow.
                </Typography>
              ) : (
                <List>
                  {recentShifts.map((shift, index) => (
                    <ListItem key={shift.id} divider={index < recentShifts.length - 1}>
                      <ListItemIcon>
                        <Today color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="subtitle2">
                              {shift.employeeName}
                            </Typography>
                            <Chip 
                              size="small" 
                              label={shift.employeeCode} 
                              variant="outlined" 
                            />
                          </Box>
                        }
                        secondary={
                          <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                            <AccessTime fontSize="small" />
                            <Typography variant="body2">
                              {new Date(shift.date).toLocaleDateString()} • {shift.startTime} - {shift.endTime}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </Box>

          {/* Quick Stats */}
          <Box sx={{ flex: '1 1 300px' }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Quick Overview
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Average hours per employee this week
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {dashboardData.totalEmployees > 0 
                      ? Math.round(dashboardData.hoursThisWeek / dashboardData.totalEmployees) 
                      : 0}h
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Most active day
                  </Typography>
                  <Typography variant="body1">
                    Today
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    System Status
                  </Typography>
                  <Chip label="All Systems Operational" color="success" size="small" />
                </Box>
              </Stack>
            </Paper>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

export default DashboardPage;