import { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Paper
} from "@mui/material";
import axios from "axios";

function App() {
  const [emailContent, setEmailContent] = useState("");
  const [tone, setTone] = useState("");
  const [generatedReply, setGeneratedReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/email/generate",
        {
          emailContent,
          tone
        }
      );

      setGeneratedReply(response.data);
    } catch (err) {
      setError("Failed to generate email reply.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#eef2ff,#f8fafc)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={4}
          sx={{
            p: 4,
            borderRadius: 4
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            AI Email Reply Generator
          </Typography>

          <Typography
            variant="body2"
            align="center"
            sx={{ mb: 3, color: "gray" }}
          >
            Generate professional email replies instantly using AI
          </Typography>

          {/* Email Input */}
          <TextField
            fullWidth
            multiline
            rows={6}
            label="Paste the email you received"
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            sx={{ mb: 3 }}
          />

          {/* Tone Selector */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Tone</InputLabel>
            <Select
              value={tone}
              label="Tone"
              onChange={(e) => setTone(e.target.value)}
            >
              <MenuItem value="">Default</MenuItem>
              <MenuItem value="professional">Professional</MenuItem>
              <MenuItem value="friendly">Friendly</MenuItem>
              <MenuItem value="casual">Casual</MenuItem>
            </Select>
          </FormControl>

          {/* Generate Button */}
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={!emailContent || loading}
            sx={{
              height: 50,
              fontWeight: "bold"
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Generate Reply"}
          </Button>

          {/* Error */}
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          {/* Generated Reply */}
          {generatedReply && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Generated Reply
              </Typography>

              <TextField
                fullWidth
                multiline
                rows={6}
                value={generatedReply}
                inputProps={{ readOnly: true }}
              />

              <Button
                variant="outlined"
                sx={{ mt: 2 }}
                onClick={() => navigator.clipboard.writeText(generatedReply)}
              >
                Copy to Clipboard
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

export default App;