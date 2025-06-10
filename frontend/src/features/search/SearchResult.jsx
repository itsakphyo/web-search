import React, { useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { SearchInput, SearchResultCard } from './index';

const SearchResult = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResults(null);
    setQuery(query.trim());
    try {
      const response = await fetch('http://localhost:8000/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || `HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      // Clean only data.result
      if (typeof data.result === 'string') {
        let cleanResult = data.result;
        if (cleanResult.trim().startsWith('"')) {
          cleanResult = cleanResult
            .replace(/^"```json\s*/, '')
            .replace(/\s*```$/, '')
            .trim();
        }
        if (cleanResult.trim().startsWith('```json')) {
          cleanResult = cleanResult
            .replace(/^```json\s*/, '')
            .replace(/\s*```$/, '')
            .trim();
        }
        if (cleanResult.trim().startsWith('json')) {
          cleanResult = cleanResult
            .replace(/^json\s*/, '')
            .trim();
        }
        try {
          data.result = JSON.parse(cleanResult);
        } catch {
          data.result = cleanResult;
        }
      }
      setResults(data);
    } catch (err) {
      setResults({ error: String(err.message || 'An error occurred') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ backgroundColor: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', px: 2, py: 4 }}>
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
        <SearchInput query={query} setQuery={setQuery} handleSearch={handleSearch} loading={loading} />
      </Box>
      {results && (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {results.error ? (
            <Typography variant="h6" color="error" gutterBottom sx={{ textAlign: 'center' }}>
              Error: {results.error}
            </Typography>
          ) : (
            <>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center', wordBreak: 'break-word', maxWidth: 1000 }}>
                Search Results for: "{results.query}"
              </Typography>
              {Array.isArray(results.result) ? (
                <Grid container spacing={3} direction="column" justifyContent="center">
                  {results.result.map((item, index) => (
                    <Grid item key={index} sx={{ display: 'flex', justifyContent: 'center', width: 800 }}>
                      <SearchResultCard item={item} />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ mt: 2, p: 3, backgroundColor: '#f8f9fa', borderRadius: 2, border: '1px solid #e9ecef', overflowX: 'auto' }}>
                  <Typography variant="body1" component="div" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                    {typeof results.result === 'string' ? results.result : JSON.stringify(results.result, null, 2)}
                  </Typography>
                </Box>
              )}
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

export default SearchResult;
