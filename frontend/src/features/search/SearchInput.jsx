import React from 'react';
import { Grid, TextField, Button, CircularProgress } from '@mui/material';

const SearchInput = ({ query, setQuery, handleSearch, loading }) => (
  <Grid container spacing={2} alignItems="center" justifyContent="center" sx={{ width: '100%', maxWidth: 700 }}>
    <Grid item xs={12} sm={9}>
      <TextField
        fullWidth
        label="Ask a question..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        variant="outlined"
        sx={{ minWidth: 550, mx: 'auto' }}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
      />
    </Grid>
    <Grid item xs={12} sm={3}>
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleSearch}
        disabled={loading}
        sx={{ height: '56px' }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Search'}
      </Button>
    </Grid>
  </Grid>
);

export default SearchInput;
