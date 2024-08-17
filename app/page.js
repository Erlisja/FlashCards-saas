'use client'
import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import Head from "next/head"; // Correctly import Head from next/head
import { SignedIn,SignedOut,UserButton } from "@clerk/nextjs";
import {Box, AppBar, Button, Container, Toolbar, Typography, Grid,Dialog,DialogActions, createTheme, ThemeProvider, Card, CardActions, CardContent, DialogContent,DialogContentText,DialogTitle } from "@mui/material";
import { useRef, useState} from "react";

const theme = createTheme({
  palette: {
    primary: {
      main: '#800080', // Purple color
    },
    background: {
      default: '#FFFFFF', // White background
    },
  },
});

const features = [
  {
    title: "Smart Flashcards",
    description: "Create flashcards from any text in seconds. Creating flashcards has never been easier. Simply paste your text and let us do the rest."
  },
  {
    title: "AI powered generator",
    description: "Our AI-powered flashcard generator will create flashcards from any text in seconds, perfect for studying and memorizing information."
  },
  {
    title: "Accessible Anywhere",
    description: "Access your flashcards from anywhere, on any device. Our cloud-based platform ensures that your flashcards are always available when you need them."
  }
];

function FeaturesSection() {
  return (
    <Box sx={{ 
      my: 6, 
      py: 6,
      px: 4,
      backgroundColor: 'background.default',
      color: 'black'
    }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ color: 'black' }}>
        Features
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card sx={{ height: '100%', border: '1px solid black', backgroundColor: '#F5F5F5' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ color: 'Black' }}>{feature.title}</Typography>
                <Typography sx={{ color: 'black' }}>{feature.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
export default function Home() {

  const [openFreeDialog, setOpenFreeDialog] = useState(false);

  const handleSubmit = async (plan) => {
    try {
      const checkoutSession = await fetch("/api/checkout_session", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan }) // Ensure you send the plan to the backend
      });
  
      if (!checkoutSession.ok) {
        const errorData = await checkoutSession.json();
        console.error('Checkout session error:', errorData.message);
        return;
      }
  
      const checkout_session = await checkoutSession.json();
      const stripe = await getStripe();
  
      const { error } = await stripe.redirectToCheckout({
        sessionId: checkout_session.id,
      });
  
      if (error) {
        console.warn('Stripe redirect error:', error.message);
      }
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  }
  const featuresRef = useRef(null);

  const scrollToFeatures = () => {
      if (featuresRef.current) {
          featuresRef.current.scrollIntoView({ behavior: "smooth" });
      }
  };



  const handleFreeClick = () => {
    setOpenFreeDialog(true);
  };

  const handleCloseFreeDialog = () => {
    setOpenFreeDialog(false);
  };

  const handleContinue = () => {
    setOpenFreeDialog(false);
    // Redirect to the generate page
    window.location.href = "/generate"; // Update the path as needed
  };



  return (
      <ThemeProvider theme={theme}>
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'White' }}>
          <Head>
            <title>Flashcard Creator</title>
            <meta name="description" content="create flashcard from your text" />
          </Head>
  
          <AppBar position="static" sx={{ backgroundColor: 'purple', width: '100%' }}>
            <Toolbar>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                MemoGenie
              </Typography>
              <SignedOut>
                <Button color="inherit" href="/sign-in">Login</Button>
                <Button color="inherit" href='/sign-up'>Sign Up</Button>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </Toolbar>
          </AppBar>

          <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          height: '80vh',
          position: 'relative',
          overflow: 'hidden',
          width: '100',
        }}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '50%',
            zIndex: 1,
            pl: 4, // Add some padding to the left
            pr: 2, // Add some padding to the right
            maxWidth: '600px', // Limit the maximum width
          }}>
            <Typography variant="h2" gutterBottom>Welcome to MemoGenie</Typography>
            <Typography variant="h6" gutterBottom>
            MemoGenie is your AI-powered companion, turning any topic into personalized flashcards, making mastery effortless and engaging.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button component='a' variant="contained" sx={{ bgcolor: '#B088F9', color: 'white' }} onClick={scrollToFeatures}>Get Started</Button>
        </Box>
        </Box>

        <Box sx={{
            position: 'absolute',
            right: 0, // Shift the image slightly off-screen to the right
            top: 0,
            width: '50%',
            height: '100%',
            zIndex: 0,
          }}>
            <Image
              src="/question-mark.png"
              alt="Background"
              layout="fill"
              objectFit="cover"
              quality={100}
            />
          </Box>
        </Box>
        <FeaturesSection />

{/* Pricing Section */}
<Box sx={{ my: 6, textAlign: 'center', backgroundColor: 'purple', py: 6, px: 4}}>
          <Typography variant="h4" align="center" gutterBottom sx={{ color: 'white' }}>
            Choose Your Plan
          </Typography>
          <Typography variant="h6" align="center" gutterBottom sx={{ color: 'white', mb: 4 }}>
            Select the package that best fits your needs
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {[
              {
                title: "Free",
                subtitle: "Get started for free",
                price: "$0",
                period: "/year",
                features: [
                  "Limited flashcard decks",
                  "Basic AI-generated flashcards"
                ],
                buttonText: "Get Started",
                onClick: handleFreeClick,
              },
              {
                title: "Basic",
                subtitle: "Unlock more features",
                price: "$0.49",
                period: "/year",
                features: [
                  "Unlimited flashcards",
                  "Detailed progress tracking",
                  "High quality AI-generated flashcards"
                ],
                buttonText: "Choose Basic",
                onClick: () => handleSubmit('basic'),
              },
              {
                title: "Pro",
                subtitle: "Unlock maximum features",
                price: "$0.99",
                period: "/year",
                features: [
                  "Create unlimited flashcards",
                  "High quality AI-generated flashcards",
                  "Advanced analytics and progress insights",
                  "AI-generated flashcards based on your content",
                  "Early access to new features"
                ],
                buttonText: "Choose Pro",
                onClick: () => handleSubmit('pro'),
              }
            ].map((plan, index) => (
              <Grid item xs={12} md={3} key={index}>
                <Card sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                  boxShadow: 3,
                  backgroundColor: 'white',
                }}>
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {plan.title}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                      {plan.subtitle}
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ my: 2, fontWeight: 'bold' }}>
                      {plan.price}<span style={{ fontSize: '1rem' }}>{plan.period}</span>
                    </Typography>
                    <Box sx={{ mt: 2, mb: 2, flexGrow: 1 }}>
                      {plan.features.map((feature, idx) => (
                        <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography sx={{ mr: 1, color: '#00A3A3' }}>✓</Typography>
                          <Typography variant="body2" align="left">{feature}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: '#B088F9',
                        '&:hover': { backgroundColor: '#B088F9' },
                        width: '80%'
                      }}
                      onClick={plan.onClick}
                    >
                      {plan.buttonText}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>



        {/* Dialog for Free Plan */}
        <Dialog
          open={openFreeDialog}
          onClose={handleCloseFreeDialog}
          aria-labelledby="free-plan-dialog-title"
          aria-describedby="free-plan-dialog-description"
        >
          <DialogTitle id="free-plan-dialog-title">Free Plan</DialogTitle>
          <DialogContent>
            <DialogContentText id="free-plan-dialog-description">
              You have selected the Free Plan. You can generate up to 3 flashcards per month. Enjoy using our app for free!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseFreeDialog} color="primary">Cancel</Button>
            <Button onClick={handleContinue} color="primary" autoFocus>
              Continue
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}
