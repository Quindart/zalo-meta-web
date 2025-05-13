import React from 'react';
import { Box, Typography } from '@mui/material';
import { getHourAndMinute } from "@/utils/formatTime";

interface MessageSystemProps {
  content: string;
  timestamp: string | number;
  type?: 'info' | 'warning' | 'success' | 'error';
}

const MessageSystem: React.FC<MessageSystemProps> = ({ 
  content, 
  timestamp, 
}) => {
  return (
    <Box 
      width="100%" 
      display="flex" 
      justifyContent="center" 
      alignItems="center"
      my={1}
      px={2}
    >
      <Box
        sx={{
          width: 'auto',
          maxWidth: '85%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative'
        }}
      >
        <Typography 
          fontSize={13}
          color="text.secondary"
          textAlign="center"
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
            px: 2,
            py: 0.5,
            borderRadius: 10,
            display: 'inline-block'
          }}
        >
          {content}
        </Typography>
        
        <Typography 
          fontSize={11}
          color="text.secondary"
          sx={{ 
            mt: 0.5,
            opacity: 0.7
          }}
        >
          {getHourAndMinute(`${timestamp}`)}
        </Typography>
      </Box>
    </Box>
  );
};

export default MessageSystem;