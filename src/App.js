

import React, { useState } from 'react';
import axios from 'axios';
import './index.css'
import {
  TextField,
  MenuItem,
  Button,
  Typography,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';

const MyForm = () => {
  const [name, setName] = useState('');
  const [config, setConfig] = useState('');
  const [visitTiming, setVisitTiming] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openOtpDialog, setOpenOtpDialog] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);

  const handleSubmit = async () => {
    if (!name || !config || !visitTiming || !phone) {
      setMessage('All fields are required.');
      return;
    }
    if (phone.length !== 10) {
      setPhoneError(true);
      setMessage('Phone number must be 10 digits.');
      return;
    }
    setPhoneError(false);

    try {
      await axios.post('https://realtor-form-backend.vercel.app/api/send-otp', { phoneNumber: phone });
      setOtpSent(true);
      setOpenConfirmDialog(true); 
    } catch (error) {
      setMessage('Failed to send OTP. Please try again.');
      console.error(error);
    }
  };

  const handleConfirm = () => {
    setOpenConfirmDialog(false); 
    setOpenOtpDialog(true);
  };

  const handleOtpVerify = async () => {
    try {
      const response = await axios.post('https://realtor-form-backend.vercel.app/api/verify-otp', { phoneNumber: phone, otp });
      if (response.data.verified) {
        try {
          await axios.post('https://realtor-form-backend.vercel.app/api/submit-form', { name, config, visitTiming, phone });
          setMessage('Thank you for showing your interest. One of our executives will assist you soon.');
          setOpenConfirmDialog(false); 
          setOtpError(false);
          setName('');
          setConfig('');
          setVisitTiming('');
          setPhone('');
          setOtp('');

        } catch (error) {
          setMessage('Failed to save form data. Please try again.');
          setOpenConfirmDialog(false); 
          setOtpSent(false)
          console.error(error);
        }
      } else {
        setMessage('Incorrect OTP. Please try again.');
        setOpenConfirmDialog(false); 
        setOtpSent(false)
        setOtpError(true);
      }
    } catch (error) {
      setMessage('OTP verification failed. Please try again.');
      setOpenConfirmDialog(false); 
      setOtpSent(false)
      setOtpError(true);
      console.error(error);
    }
    setOpenOtpDialog(false); 
  };

  const handleGoBack = () => {
    setOpenConfirmDialog(false); 
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', background:'#e3fcf7'}}>
      <img
        src="https://i.redd.it/o96asqovzgi51.jpg"
        alt="Project"
        style={{ width: '100%', height: '100px', marginBottom: '20px' }}
      />
      {message && (
        <Alert severity={otpSent ? 'success' : 'warning'} style={{ marginBottom: '20px' }}>
          {message}
        </Alert>
      )}
      <Typography variant="h6" style={{ marginBottom: '20px' }}>Form Detail & Content</Typography>
      <TextField
        fullWidth
        label="Please Enter Your Full Name"
        variant="outlined"
        margin="normal"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <TextField
        fullWidth
        select
        label="Please Select Your Choice of Configuration"
        variant="outlined"
        margin="normal"
        value={config}
        onChange={(e) => setConfig(e.target.value)}
        required
      >
        <MenuItem value="1BHK">1BHK</MenuItem>
        <MenuItem value="2BHK">2BHK</MenuItem>
      </TextField>
      <TextField
        fullWidth
        select
        label="How Soon You are Planning to Visit"
        variant="outlined"
        margin="normal"
        value={visitTiming}
        onChange={(e) => setVisitTiming(e.target.value)}
        required
      >
        <MenuItem value="This Weekend">This Weekend</MenuItem>
        <MenuItem value="In Week Days">In Week Days</MenuItem>
        <MenuItem value="Next Weekend">Next Weekend</MenuItem>
      </TextField>
      <TextField
        fullWidth
        label="Please Enter Your Phone No."
        variant="outlined"
        margin="normal"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
        error={phoneError}
        helperText={phoneError ? 'Phone number must be 10 digits.' : ''}
        inputProps={{ maxLength: 10 }}
      />
      <Button variant="contained" color="primary" onClick={handleSubmit} style={{ marginTop: '20px' }}>
        Submit
      </Button>
      
      <Typography variant="body2" color="textSecondary" style={{ marginTop: '20px' }}>
        Note – We use this information only to contact you for your query.
      </Typography>

      <Dialog open={openConfirmDialog} maxWidth="sm"  onClose={() => setOpenConfirmDialog(false)}>
        <DialogTitle>Verify Your Phone Number</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            An OTP has been sent to your phone number. Please enter the OTP to confirm your request.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleGoBack} color="primary">
            Go Back
          </Button>
          <Button onClick={() => setOpenOtpDialog(true)} color="primary">
            Enter OTP
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openOtpDialog} width="sm"  onClose={() => setOpenOtpDialog(false)}>
        <DialogTitle>Enter OTP</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Enter OTP"
            variant="outlined"
            margin="normal"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            error={otpError}
            helperText={otpError ? 'Incorrect OTP. Please try again.' : ''}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenOtpDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleOtpVerify} color="primary">
            Verify OTP
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MyForm;
