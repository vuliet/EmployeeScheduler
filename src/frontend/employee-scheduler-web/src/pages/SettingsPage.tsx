import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Stack,
  MenuItem,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Business,
  Person,
  Notifications,
  Security,
  Palette
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const [settings, setSettings] = useState({
    // Organization settings
    organizationName: user?.tenantName || '',
    timeZone: 'UTC',
    dateFormat: 'MM/dd/yyyy',
    
    // Personal settings
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    
    // Notification settings
    emailNotifications: true,
    shiftReminders: true,
    scheduleUpdates: true,
    
    // Display settings
    theme: 'light',
    language: 'en-US'
  });

  const handleSave = async () => {
    try {
      // TODO: Implement API call to save settings
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setError('Failed to save settings');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleChange = (field: string, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      {message && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Stack spacing={3}>
        {/* Top Row - Organization and Personal Settings */}
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {/* Organization Settings */}
          <Box sx={{ flex: '1 1 400px' }}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Business color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Organization Settings</Typography>
                </Box>
                
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    label="Organization Name"
                    value={settings.organizationName}
                    onChange={(e) => handleChange('organizationName', e.target.value)}
                  />
                  
                  <TextField
                    select
                    fullWidth
                    label="Time Zone"
                    value={settings.timeZone}
                    onChange={(e) => handleChange('timeZone', e.target.value)}
                  >
                    <MenuItem value="UTC">UTC</MenuItem>
                    <MenuItem value="America/New_York">Eastern Time</MenuItem>
                    <MenuItem value="America/Chicago">Central Time</MenuItem>
                    <MenuItem value="America/Denver">Mountain Time</MenuItem>
                    <MenuItem value="America/Los_Angeles">Pacific Time</MenuItem>
                    <MenuItem value="Europe/London">London</MenuItem>
                    <MenuItem value="Europe/Berlin">Berlin</MenuItem>
                    <MenuItem value="Asia/Tokyo">Tokyo</MenuItem>
                  </TextField>
                  
                  <TextField
                    select
                    fullWidth
                    label="Date Format"
                    value={settings.dateFormat}
                    onChange={(e) => handleChange('dateFormat', e.target.value)}
                  >
                    <MenuItem value="MM/dd/yyyy">MM/dd/yyyy</MenuItem>
                    <MenuItem value="dd/MM/yyyy">dd/MM/yyyy</MenuItem>
                    <MenuItem value="yyyy-MM-dd">yyyy-MM-dd</MenuItem>
                  </TextField>
                </Stack>
              </CardContent>
            </Card>
          </Box>

          {/* Personal Settings */}
          <Box sx={{ flex: '1 1 400px' }}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Person color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Personal Settings</Typography>
                </Box>
                
                <Stack spacing={2}>
                  <Box display="flex" gap={2}>
                    <TextField
                      fullWidth
                      label="First Name"
                      value={settings.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                    />
                    <TextField
                      fullWidth
                      label="Last Name"
                      value={settings.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                    />
                  </Box>
                  
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={settings.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                  />

                  <TextField
                    select
                    fullWidth
                    label="Language"
                    value={settings.language}
                    onChange={(e) => handleChange('language', e.target.value)}
                  >
                    <MenuItem value="en-US">English (US)</MenuItem>
                    <MenuItem value="en-GB">English (UK)</MenuItem>
                    <MenuItem value="es-ES">Español</MenuItem>
                    <MenuItem value="fr-FR">Français</MenuItem>
                    <MenuItem value="de-DE">Deutsch</MenuItem>
                    <MenuItem value="ja-JP">日本語</MenuItem>
                  </TextField>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Second Row - Notification and Display Settings */}
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {/* Notification Settings */}
          <Box sx={{ flex: '1 1 400px' }}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Notifications color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Notification Settings</Typography>
                </Box>
                
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Notifications />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Email Notifications" 
                      secondary="Receive general notifications via email"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.emailNotifications}
                          onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                        />
                      }
                      label=""
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <Security />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Shift Reminders" 
                      secondary="Get reminders about upcoming shifts"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.shiftReminders}
                          onChange={(e) => handleChange('shiftReminders', e.target.checked)}
                        />
                      }
                      label=""
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <Business />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Schedule Updates" 
                      secondary="Notifications when schedules are published"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.scheduleUpdates}
                          onChange={(e) => handleChange('scheduleUpdates', e.target.checked)}
                        />
                      }
                      label=""
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Box>

          {/* Display Settings */}
          <Box sx={{ flex: '1 1 400px' }}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Palette color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Display Settings</Typography>
                </Box>
                
                <Stack spacing={2}>
                  <TextField
                    select
                    fullWidth
                    label="Theme"
                    value={settings.theme}
                    onChange={(e) => handleChange('theme', e.target.value)}
                  >
                    <MenuItem value="light">Light</MenuItem>
                    <MenuItem value="dark">Dark</MenuItem>
                    <MenuItem value="auto">Auto (System)</MenuItem>
                  </TextField>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Account Information */}
        <Box>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Account Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ flex: '1 1 200px' }}>
                  <Typography variant="body2" color="textSecondary">
                    Account Type
                  </Typography>
                  <Typography variant="body1">
                    Administrator
                  </Typography>
                </Box>
                
                <Box sx={{ flex: '1 1 200px' }}>
                  <Typography variant="body2" color="textSecondary">
                    Organization Domain
                  </Typography>
                  <Typography variant="body1">
                    testcompany
                  </Typography>
                </Box>
                
                <Box sx={{ flex: '1 1 200px' }}>
                  <Typography variant="body2" color="textSecondary">
                    Member Since
                  </Typography>
                  <Typography variant="body1">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </Typography>
                </Box>
                
                <Box sx={{ flex: '1 1 200px' }}>
                  <Typography variant="body2" color="textSecondary">
                    Last Login
                  </Typography>
                  <Typography variant="body1">
                    Today
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Save Button */}
        <Box display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            size="large"
            onClick={handleSave}
          >
            Save Settings
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default SettingsPage;