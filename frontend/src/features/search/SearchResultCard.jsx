import React from 'react';
import { Card, CardContent, Box, Typography, useMediaQuery, useTheme } from '@mui/material';

const SearchResultCard = ({ item }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <Card
      variant="outlined"
      sx={{
        width: isSmallScreen ? '100%' : 800,
        mx: 2,
        height: '100%',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: 4,
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {Object.entries(item).map(([key, value]) => (
          <Box
            key={key}
            sx={{
              mb: 2,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 2,
              flexDirection: isSmallScreen ? 'column' : 'row',
              maxWidth: '100%',
              wordBreak: 'break-word',
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 'bold',
                textTransform: 'capitalize',
                color: 'text.secondary',
                minWidth: '150px',
                flexShrink: 0,
              }}
            >
              {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}:
            </Typography>
            <Typography
              variant="body2"
              sx={{
                borderLeft: '3px solid',
                borderLeftColor: 'primary.light',
                backgroundColor: 'grey.50',
                p: 1,
                borderRadius: 1,
                flex: 1,
                wordBreak: 'break-word',
              }}
            >
              {String(value)}
            </Typography>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

export default SearchResultCard;
