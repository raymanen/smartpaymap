import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Container, Button, useTheme } from '@mui/material';
import { UploadFile as UploadFileIcon } from '@mui/icons-material';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { ctaSectionStyles } from '../../styles/components/CTASection.styles';
// Using existing CtaSectionProps from types

const CTASection = memo(() => {
  const title = "Ready to Impress?";
  const subtitle = "This project showcases modern React, TypeScript, Python & AI integration. Experience cutting-edge web development in action.";
  const buttonText = "Explore the Demo";
  const [ref, isVisible] = useScrollAnimation(0.4);
  const navigate = useNavigate();
  const theme = useTheme();
  const styles = ctaSectionStyles(theme);

  const handleClick = () => {
    navigate('/mapping');
  };

  return (
    <Box
      sx={styles.root}
    >
      <Container ref={ref} maxWidth="md" sx={styles.container}>
        <Typography
          variant="h3"
          sx={styles.title(isVisible)}
        >
          {title}
        </Typography>
        
        <Typography
          variant="body1"
          sx={styles.subtitle(isVisible)}
        >
          {subtitle}
        </Typography>
        
        <Button
          variant="contained"
          size="large"
          startIcon={<UploadFileIcon />}
          onClick={handleClick}
          sx={styles.button(isVisible)}
        >
          {buttonText}
        </Button>
      </Container>
    </Box>
  );
});

CTASection.displayName = 'CTASection';

export default CTASection; 