import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Container, Typography, Grid, Button } from "@mui/material";
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import { Stack } from '@mui/material';
import LineChart from './LineChart';



interface Device {
  device_number: number;
  device_name: string;
  storage_capacity_GB: any;
  average_cpu_usage: number;
  average_download_speed: number;
  average_gpu_usage: number;
  average_ram_usage: number;
  average_time_online: number;
  average_upload_speed: number;
  onlineStatus: string;
  cpu_usage: number[];
  date_added: Date[];
  device_priority: number;
  download_network_speed: number[];
  gpu_usage: number[];
  ip_address: string;
  network_reliability: number;
  optimization_status: boolean;
  ram_usage: number[];
  sync_status: boolean;
  upload_network_speed: number[];
  online: boolean;
  // Add more device properties as needed
}

interface UserResponse {
  devices: Device[];
  first_name: string;
  last_name: string;
  // Include other fields from your API response as needed
}


const { ipcRenderer } = window.require('electron');

ipcRenderer.on('python-output', (event: any, data: any) => {
  console.log('Received Python output:', data);
});




export default function DevicesTable() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<UserResponse>('https://website2-v3xlkt54dq-uc.a.run.app/getuserinfo/');
        const data = response.data;
        // Processing data for the frontend, assuming your API returns data directly usable by the UI
        const roundedDevices = data.devices.map(device => ({
          ...device,
          average_upload_speed: parseFloat(device.average_upload_speed.toFixed(2)),
          storage_capacity_GB: formatBytes(device.storage_capacity_GB),
          average_download_speed: parseFloat(device.average_download_speed.toFixed(2)),
          average_gpu_usage: parseFloat(device.average_gpu_usage.toFixed(2)),
          average_cpu_usage: parseFloat(device.average_cpu_usage.toFixed(2)),
          average_ram_usage: parseFloat(device.average_ram_usage.toFixed(2)),
          date_added: device.date_added.map(dateStr => new Date(dateStr)), // Transforming date strings to Date objects
          onlineStatus: device.online ? "Online" : "Offline"
        }));

        setDevices(roundedDevices);
        setFirstname(data.first_name);
        setLastname(data.last_name);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);



function formatBytes(gigabytes: number, decimals: number = 2): string {
  if (gigabytes === 0) return '0 GB';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  // Since we're starting from GB, there's no need to find the initial index based on the log.
  // Instead, we convert the input gigabytes to bytes to use the original formula,
  // adjusting it to start from GB.
  const bytes = gigabytes * Math.pow(k, 3); // Converting GB to Bytes for calculation
  const i = Math.floor(Math.log(bytes) / Math.log(k)) - 3; // Adjusting index to start from GB

  // Ensure the index does not fall below 0
  const adjustedIndex = Math.max(i, 0);

  return parseFloat((gigabytes / Math.pow(k, adjustedIndex)).toFixed(dm)) + ' ' + sizes[adjustedIndex];
}

  useEffect(() => {
    const interval = setInterval(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<UserResponse>('https://website2-v3xlkt54dq-uc.a.run.app/getuserinfo/');
        const data = response.data;
        // Processing data for the frontend, assuming your API returns data directly usable by the UI
        const roundedDevices = data.devices.map(device => ({
          ...device,
          average_upload_speed: parseFloat(device.average_upload_speed.toFixed(2)),
          storage_capacity_GB: formatBytes(device.storage_capacity_GB),
          average_download_speed: parseFloat(device.average_download_speed.toFixed(2)),
          average_gpu_usage: parseFloat(device.average_gpu_usage.toFixed(2)),
          average_cpu_usage: parseFloat(device.average_cpu_usage.toFixed(2)),
          average_ram_usage: parseFloat(device.average_ram_usage.toFixed(2)),
          date_added: device.date_added.map(dateStr => new Date(dateStr)), // Transforming date strings to Date objects
          onlineStatus: device.online ? "Online" : "Offline"
        }));

        setDevices(roundedDevices);
        setFirstname(data.first_name);
        setLastname(data.last_name);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, 10000); // Refresh every 10 seconds 

    return () => clearInterval(interval);
  },
  []);


  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = devices.map((device) => device.device_number);
      setSelected(newSelected);
    } else {
      setSelected([]);
    }
  };

  const handleClick = (event: React.MouseEvent<unknown>, device_number: number) => {
    const selectedIndex = selected.indexOf(device_number);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, device_number);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (device_number: number) => selected.indexOf(device_number) !== -1;


  const [Firstname, setFirstname] = useState<string>('');
  const [Lastname, setLastname] = useState<string>('');
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<{
          devices: any[] 
          first_name: string;
          last_name: string;
        }>('https://website2-v3xlkt54dq-uc.a.run.app/getuserinfo/');

        const fetchedFirstname = response.data.first_name;
        const fetchedLastname = response.data.last_name;
        setFirstname(fetchedFirstname); 
        setLastname(fetchedLastname); 
        console.log(fetchedFirstname);
     } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);


  return (
    <Container>

      <Box sx={{ width: '100%', mt: 0, pt: 4 }}>

        <Stack spacing={2}>
         <Grid container justifyContent="space-between" alignItems="center" spacing={2}>

            <Grid item>
          <Typography variant="h2" textAlign="left">
            Devices
          </Typography>
            </Grid>
            <Grid item>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
        <Chip avatar={<Avatar>{Firstname.charAt(0)}</Avatar>} label={`${Firstname} ${Lastname}`} />
      </Box>
            </Grid>
            </Grid>
          <Grid container spacing={1}>
            <Grid item>
              <Button variant="outlined" size="small">Add Device</Button>
            </Grid>
            <Grid item>
              <Button variant="outlined" size="small">Remove Device</Button>
            </Grid>
          </Grid>
      </Stack>

        <Box my={2}>
            <TableContainer>
              <Table sx={{ minWidth: 750 }} size="small">
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        indeterminate={selected.length > 0 && selected.length < devices.length}
                        checked={devices.length > 0 && selected.length === devices.length}
                        onChange={handleSelectAllClick}
                        inputProps={{ 'aria-label': 'select all devices' }}
                      />
                    </TableCell>
                    <TableCell align='left'>Name</TableCell>
                    <TableCell align='left'>IP Address</TableCell>
                    <TableCell align='left'>Total Storage</TableCell>
                    <TableCell align='left'>Status</TableCell>
                    <TableCell align='left'>Avg. Upload Speed</TableCell>
                    <TableCell align='left'>Avg. Download Speed</TableCell>
                    <TableCell align='left'>Avg. GPU usage</TableCell>
                    <TableCell align='left'>Avg. CPU usage</TableCell>
                    <TableCell align='left'>Avg. RAM usage</TableCell>
                    {/* Add more table headers as needed */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? devices.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : devices
                  ).map((device) => {
                    const isItemSelected = isSelected(device.device_number);
                    const labelId = `enhanced-table-checkbox-${device.device_number}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, device.device_number)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={device.device_number}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{ 'aria-labelledby': labelId }}
                          />
                        </TableCell>
                        <TableCell align='left' component="th" id={labelId} scope="row">
                          {device.device_name}
                        </TableCell>

                        <TableCell align='left' component="th" id={labelId} scope="row">
                          {device.ip_address}
                        </TableCell>

                        <TableCell align='right'component="th" id={labelId} scope="row">
                          {device.storage_capacity_GB}
                        </TableCell>
 
                        <TableCell align='left'component="th" id={labelId} scope="row" style={{ color: device.onlineStatus === "Online" ? "#1DB954" : "red" }}>
                          {device.onlineStatus}
                        </TableCell>
 
                        <TableCell align='right'component="th" id={labelId} scope="row">
                          {device.average_upload_speed}
                        </TableCell>
 
                        <TableCell align='right'component="th" id={labelId} scope="row">
                          {device.average_download_speed}
                        </TableCell>
 
                        <TableCell align='right'component="th" id={labelId} scope="row">
                          {device.average_gpu_usage}
                        </TableCell>
 
                        <TableCell align='right'component="th" id={labelId} scope="row">
                          {device.average_cpu_usage}
                        </TableCell>
 
                        <TableCell align='right'component="th" id={labelId} scope="row">
                          {device.average_ram_usage}
                        </TableCell>
  

                        {/* Render other device details here */}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={devices.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          <LineChart />
        </Box>
      </Box>
    </Container>
  );
}

