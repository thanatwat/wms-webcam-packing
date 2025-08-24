import React, { useState, useRef, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  TextField,
  Alert,
  CircularProgress,
  Card,
  CardContent
} from '@mui/material';
import { VideoCameraBack, Stop, Send } from '@mui/icons-material';

const JobPackScanPage = () => {
  const [jobId, setJobId] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const videoRef = useRef(null);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const handleJobIdSubmit = async (e) => {
    e.preventDefault();
    if (!jobId.trim()) {
      setError('Please enter a Job ID');
      return;
    }
    
    setError('');
    await startRecording();
  };

  const startRecording = async () => {
    try {
      setLoading(true);
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        },
        audio: true
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      const recorder = new MediaRecorder(mediaStream, {
        mimeType: 'video/webm;codecs=vp9'
      });
      
      const chunks = [];
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      recorder.onstop = () => {
        setRecordedChunks(chunks);
      };
      
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setSuccess(`Recording started for Job ID: ${jobId}`);
      
    } catch (err) {
      setError('Failed to access camera. Please check permissions.');
      console.error('Camera access error:', err);
    } finally {
      setLoading(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    }
  };

  const handleUpload = async () => {
    if (recordedChunks.length === 0) {
      setError('No recording available');
      return;
    }
    
    try {
      setLoading(true);
      
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const fileName = `job-${jobId}-${Date.now()}.webm`;
      
      // Here you would implement the actual Google Drive upload
      // For now, we'll simulate it
      setTimeout(() => {
        setSuccess(`Video uploaded successfully for Job ID: ${jobId}`);
        setRecordedChunks([]);
        setJobId('');
        setLoading(false);
      }, 2000);
      
    } catch (err) {
      setError('Failed to upload video');
      setLoading(false);
    }
  };

  const resetForm = () => {
    setJobId('');
    setRecordedChunks([]);
    setError('');
    setSuccess('');
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsRecording(false);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Job Pack Barcode Scan
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        
        <Paper sx={{ p: 3, mb: 3 }}>
          <form onSubmit={handleJobIdSubmit}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                fullWidth
                label="Job Packing ID"
                value={jobId}
                onChange={(e) => setJobId(e.target.value)}
                placeholder="Scan barcode or enter Job ID manually"
                disabled={isRecording}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={isRecording || loading}
                startIcon={<VideoCameraBack />}
              >
                Start Recording
              </Button>
            </Box>
          </form>
        </Paper>
        
        {(stream || recordedChunks.length > 0) && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ textAlign: 'center' }}>
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  style={{
                    width: '100%',
                    maxWidth: '640px',
                    height: 'auto',
                    borderRadius: '8px'
                  }}
                />
                
                <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'center' }}>
                  {isRecording ? (
                    <Button
                      variant="contained"
                      color="error"
                      onClick={stopRecording}
                      startIcon={<Stop />}
                    >
                      Stop Recording
                    </Button>
                  ) : recordedChunks.length > 0 ? (
                    <>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUpload}
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : <Send />}
                      >
                        Upload Video
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={resetForm}
                      >
                        New Recording
                      </Button>
                    </>
                  ) : null}
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
    </Container>
  );
};

export default JobPackScanPage;
