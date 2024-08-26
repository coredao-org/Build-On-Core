import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(type, amount, interest, p2pType, duration) {
  return { type, amount, interest, p2pType, duration };
}

const rows = [
  createData('Deposit Collateral', 2000, 0, 'Request', 0),
  createData('Loan Offer', 1500, 2,'Offer', 3),
  createData('Loan Request', 1200, 5, 'Request', 6),
];

const RecentData =  () => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650, backgroundColor: '#e0bb83b9' }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Transaction Type</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="right">Interest</TableCell>
            <TableCell align="right">P2P Type</TableCell>
            <TableCell align="right">Duration</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.type}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.type}
              </TableCell>
              <TableCell align="right">{row.amount}</TableCell>
              <TableCell align="right">{row.interest}</TableCell>
              <TableCell align="right">{row.p2pType}</TableCell>
              <TableCell align="right">{row.duration}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default RecentData;