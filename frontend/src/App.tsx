import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, TextField, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import DataTable from 'react-data-table-component';
import { useForm, Controller } from 'react-hook-form';
import { backend } from 'declarations/backend';
import styled from '@emotion/styled';

interface TaxPayer {
  tid: string;
  firstName: string;
  lastName: string;
  address: string;
}

const HeroSection = styled.div`
  background-image: url('https://bsmedia.business-standard.com/_media/bs/img/article/2023-04/27/full/1682617409-5526.jpg?im=FeatureCrop,size=(826,465)');
  background-size: cover;
  background-position: center;
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
  margin-bottom: 2rem;
`;

const App: React.FC = () => {
  const [taxPayers, setTaxPayers] = useState<TaxPayer[]>([]);
  const [searchTid, setSearchTid] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingTaxPayer, setEditingTaxPayer] = useState<TaxPayer | null>(null);
  const { control, handleSubmit, reset, setValue } = useForm<TaxPayer>();

  const columns = [
    { name: 'TID', selector: (row: TaxPayer) => row.tid, sortable: true },
    { name: 'First Name', selector: (row: TaxPayer) => row.firstName, sortable: true },
    { name: 'Last Name', selector: (row: TaxPayer) => row.lastName, sortable: true },
    { name: 'Address', selector: (row: TaxPayer) => row.address, sortable: true },
    {
      name: 'Actions',
      cell: (row: TaxPayer) => (
        <Button onClick={() => handleEditClick(row)} variant="contained" color="primary" size="small">
          Edit
        </Button>
      ),
    },
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
      setSearchPerformed(true);
      try {
        const result = await backend.searchTaxPayer(searchTid);
        if (result) {
          setTaxPayers([result]);
        } else {
          setTaxPayers([]);
        }
      } catch (error) {
        console.error('Error searching tax payer:', error);
        setTaxPayers([]);
      }
      setLoading(false);
    } else {
      setSearchPerformed(false);
      fetchTaxPayers();
    }
  };

  const handleEditClick = (taxPayer: TaxPayer) => {
    setEditingTaxPayer(taxPayer);
    setValue('tid', taxPayer.tid);
    setValue('firstName', taxPayer.firstName);
    setValue('lastName', taxPayer.lastName);
    setValue('address', taxPayer.address);
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (data: TaxPayer) => {
    setLoading(true);
    try {
      const success = await backend.updateTaxPayer(data.tid, data.firstName, data.lastName, data.address);
      if (success) {
        setEditModalOpen(false);
        await fetchTaxPayers();
      } else {
        console.error('Failed to update tax payer');
      }
    } catch (error) {
      console.error('Error updating tax payer:', error);
    }
    setLoading(false);
  };

  return (
    <>
      <HeroSection>
        <Typography variant="h2" component="h1" gutterBottom>
          TaxPayer Management System
        </Typography>
        <Typography variant="h5" gutterBottom>
          by Dominic Williams
        </Typography>
      </HeroSection>
      <Container maxWidth="lg">
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
            {searchPerformed && taxPayers.length === 0 && (
              <Typography variant="body1" color="error" gutterBottom>
                No tax payer found with the given TID.
              </Typography>
            )}
            <DataTable
              columns={columns}
              data={taxPayers}
              pagination
              progressPending={loading}
            />
          </Grid>
        </Grid>
      </Container>
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <DialogTitle>Edit TaxPayer</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(handleEditSubmit)}>
            <Controller
              name="tid"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="TID"
                  fullWidth
                  margin="normal"
                  disabled
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
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit(handleEditSubmit)} color="primary" variant="contained" disabled={loading}>
            {loading ? 'Updating...' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default App;
