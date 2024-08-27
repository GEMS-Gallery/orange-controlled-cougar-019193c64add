import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, TextField, Button, Box } from '@mui/material';
import DataTable from 'react-data-table-component';
import { useForm, Controller } from 'react-hook-form';
import { backend } from 'declarations/backend';

interface TaxPayer {
  tid: string;
  firstName: string;
  lastName: string;
  address: string;
}

const App: React.FC = () => {
  const [taxPayers, setTaxPayers] = useState<TaxPayer[]>([]);
  const [searchTid, setSearchTid] = useState('');
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, reset } = useForm<TaxPayer>();

  const columns = [
    { name: 'TID', selector: (row: TaxPayer) => row.tid, sortable: true },
    { name: 'First Name', selector: (row: TaxPayer) => row.firstName, sortable: true },
    { name: 'Last Name', selector: (row: TaxPayer) => row.lastName, sortable: true },
    { name: 'Address', selector: (row: TaxPayer) => row.address, sortable: true },
  ];

  const fetchTaxPayers = async () => {
    setLoading(true);
    try {
      const result = await backend.getTaxPayers();
      setTaxPayers(result);
    } catch (error) {
      console.error('Error fetching tax payers:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTaxPayers();
  }, []);

  const onSubmit = async (data: TaxPayer) => {
    setLoading(true);
    try {
      await backend.createTaxPayer(data.tid, data.firstName, data.lastName, data.address);
      reset();
      await fetchTaxPayers();
    } catch (error) {
      console.error('Error creating tax payer:', error);
    }
    setLoading(false);
  };

  const handleSearch = async () => {
    if (searchTid) {
      setLoading(true);
      try {
        const result = await backend.searchTaxPayer(searchTid);
        if (result) {
          setTaxPayers([result]);
        } else {
          setTaxPayers([]);
        }
      } catch (error) {
        console.error('Error searching tax payer:', error);
      }
      setLoading(false);
    } else {
      fetchTaxPayers();
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        TaxPayer Management System
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom>
            Add New TaxPayer
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="tid"
              control={control}
              defaultValue=""
              rules={{ required: 'TID is required' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="TID"
                  fullWidth
                  margin="normal"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
            <Controller
              name="firstName"
              control={control}
              defaultValue=""
              rules={{ required: 'First Name is required' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="First Name"
                  fullWidth
                  margin="normal"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
            <Controller
              name="lastName"
              control={control}
              defaultValue=""
              rules={{ required: 'Last Name is required' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Last Name"
                  fullWidth
                  margin="normal"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
            <Controller
              name="address"
              control={control}
              defaultValue=""
              rules={{ required: 'Address is required' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Address"
                  fullWidth
                  margin="normal"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? 'Adding...' : 'Add TaxPayer'}
            </Button>
          </form>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom>
            TaxPayer Records
          </Typography>
          <Box display="flex" mb={2}>
            <TextField
              label="Search by TID"
              value={searchTid}
              onChange={(e) => setSearchTid(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
              disabled={loading}
              style={{ marginLeft: '8px', height: '56px' }}
            >
              Search
            </Button>
          </Box>
          <DataTable
            columns={columns}
            data={taxPayers}
            pagination
            progressPending={loading}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default App;
