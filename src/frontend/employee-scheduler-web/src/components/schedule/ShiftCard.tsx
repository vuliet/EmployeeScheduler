import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Delete,
  CheckCircle,
  Cancel
} from '@mui/icons-material';
import { Shift, ShiftStatus, ShiftType } from '../../services/scheduleService';

interface ShiftCardProps {
  shift: Shift;
  onEdit: (shift: Shift) => void;
  onDelete: (shift: Shift) => void;
  onStatusChange: (shift: Shift, status: ShiftStatus) => void;
}

const ShiftCard: React.FC<ShiftCardProps> = ({
  shift,
  onEdit,
  onDelete,
  onStatusChange
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getShiftTypeColor = (type: ShiftType) => {
    switch (type) {
      case ShiftType.Morning: return 'primary';
      case ShiftType.Afternoon: return 'secondary';
      case ShiftType.Evening: return 'warning';
      case ShiftType.Night: return 'info';
      default: return 'default';
    }
  };

  const getShiftTypeLabel = (type: ShiftType) => {
    switch (type) {
      case ShiftType.Morning: return 'Morning';
      case ShiftType.Afternoon: return 'Afternoon';
      case ShiftType.Evening: return 'Evening';
      case ShiftType.Night: return 'Night';
      default: return 'Unknown';
    }
  };

  const getStatusColor = (status: ShiftStatus) => {
    switch (status) {
      case ShiftStatus.Scheduled: return 'default';
      case ShiftStatus.InProgress: return 'info';
      case ShiftStatus.Completed: return 'success';
      case ShiftStatus.Cancelled: return 'error';
      case ShiftStatus.NoShow: return 'warning';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: ShiftStatus) => {
    switch (status) {
      case ShiftStatus.Scheduled: return 'Scheduled';
      case ShiftStatus.InProgress: return 'In Progress';
      case ShiftStatus.Completed: return 'Completed';
      case ShiftStatus.Cancelled: return 'Cancelled';
      case ShiftStatus.NoShow: return 'No Show';
      default: return 'Unknown';
    }
  };

  return (
    <Card sx={{ mb: 1, backgroundColor: shift.isOvertime ? '#fff3e0' : 'inherit' }}>
      <CardContent sx={{ py: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box flex={1}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Typography variant="subtitle2" fontWeight="bold">
                {shift.employeeName}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                ({shift.employeeCode})
              </Typography>
              <Chip
                size="small"
                label={getShiftTypeLabel(shift.shiftType)}
                color={getShiftTypeColor(shift.shiftType)}
              />
              {shift.isOvertime && (
                <Chip size="small" label="Overtime" color="warning" variant="outlined" />
              )}
            </Box>
            
            <Typography variant="body2" color="textSecondary" gutterBottom>
              {new Date(shift.date).toLocaleDateString()} • {shift.startTime} - {shift.endTime}
            </Typography>
            
            {shift.notes && (
              <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic' }}>
                {shift.notes}
              </Typography>
            )}
            
            <Box mt={1}>
              <Chip
                size="small"
                label={getStatusLabel(shift.status)}
                color={getStatusColor(shift.status)}
                variant="outlined"
              />
            </Box>
          </Box>
          
          <IconButton size="small" onClick={handleMenuOpen}>
            <MoreVert />
          </IconButton>
        </Box>
      </CardContent>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => { onEdit(shift); handleMenuClose(); }}>
          <Edit sx={{ mr: 1 }} fontSize="small" />
          Edit
        </MenuItem>
        {shift.status === ShiftStatus.Scheduled && (
          <MenuItem onClick={() => { onStatusChange(shift, ShiftStatus.InProgress); handleMenuClose(); }}>
            <CheckCircle sx={{ mr: 1 }} fontSize="small" />
            Start Shift
          </MenuItem>
        )}
        {shift.status === ShiftStatus.InProgress && (
          <MenuItem onClick={() => { onStatusChange(shift, ShiftStatus.Completed); handleMenuClose(); }}>
            <CheckCircle sx={{ mr: 1 }} fontSize="small" />
            Complete
          </MenuItem>
        )}
        {(shift.status === ShiftStatus.Scheduled || shift.status === ShiftStatus.InProgress) && (
          <MenuItem onClick={() => { onStatusChange(shift, ShiftStatus.Cancelled); handleMenuClose(); }}>
            <Cancel sx={{ mr: 1 }} fontSize="small" />
            Cancel
          </MenuItem>
        )}
        <MenuItem onClick={() => { onDelete(shift); handleMenuClose(); }} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1 }} fontSize="small" />
          Delete
        </MenuItem>
      </Menu>
    </Card>
  );
};

export default ShiftCard;