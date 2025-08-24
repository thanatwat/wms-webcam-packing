import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import { ContentCopy, PlayArrow } from '@mui/icons-material';
import { videosAPI } from '../services/api';

const VideoListPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState('');

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await videosAPI.getVideos();
      setVideos(response.data.videos);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch videos');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (link) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopySuccess('Link copied to clipboard!');
      setTimeout(() => setCopySuccess(''), 3000);
    } catch (err) {
      setError('Failed to copy link');
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return 'Unknown';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'uploading': return 'warning';
      case 'completed': return 'success';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Recorded Videos
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {copySuccess && <Alert severity="success" sx={{ mb: 2 }}>{copySuccess}</Alert>}
        
        {videos.length === 0 ? (
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary">
                No videos recorded yet
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {videos.map((video) => (
              <Grid item xs={12} md={6} lg={4} key={video.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" component="h2" noWrap>
                        Job: {video.jobId}
                      </Typography>
                      <Chip
                        label={video.uploadStatus}
                        color={getStatusColor(video.uploadStatus)}
                        size="small"
                      />
                    </Box>
                    
                    <Typography color="text.secondary" gutterBottom>
                      Packer: {video.packerName}
                    </Typography>
                    
                    <Typography color="text.secondary" gutterBottom>
                      Duration: {formatDuration(video.duration)}
                    </Typography>
                    
                    <Typography color="text.secondary" gutterBottom>
                      Size: {formatFileSize(video.fileSize)}
                    </Typography>
                    
                    <Typography color="text.secondary" gutterBottom>
                      Recorded: {new Date(video.recordedAt).toLocaleString()}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                      {video.fileName}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {video.uploadStatus === 'completed' && (
                        <>
                          <Button
                            size="small"
                            startIcon={<PlayArrow />}
                            onClick={() => window.open(video.shareableLink, '_blank')}
                          >
                            View
                          </Button>
                          <IconButton
                            size="small"
                            onClick={() => copyToClipboard(video.shareableLink)}
                            title="Copy shareable link"
                          >
                            <ContentCopy />
                          </IconButton>
                        </>
                      )}
                      
                      {video.uploadStatus === 'uploading' && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CircularProgress size={16} />
                          <Typography variant="body2">Uploading...</Typography>
                        </Box>
                      )}
                      
                      {video.uploadStatus === 'failed' && (
                        <Button size="small" color="error">
                          Upload Failed
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default VideoListPage;
