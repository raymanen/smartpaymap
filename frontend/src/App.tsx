import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { UploadPreview } from './components/UploadPreview';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <UploadPreview />
      </Container>
    </ThemeProvider>
  );
}

export default App;
