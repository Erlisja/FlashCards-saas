'use client'
import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import Head from "next/head"; // Correctly import Head from next/head
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Box, AppBar, Button, Container, Toolbar, Typography, Grid, Dialog, DialogActions, createTheme, ThemeProvider, Card, CardActions, CardContent, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useRef, useState } from "react";

// Create a theme instance.
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

// Features data.
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
// Features section component.
function FeaturesSection({ featuresRef }) {
  return (

    <Box ref={featuresRef}
      sx={{
        my: 8,
        py: 8,
        px: 6,
        backgroundColor: 'background.default',
        color: 'black',
        textAlign: 'center',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',


      }}>
      <Typography variant="h4" align="center" mb={6} sx={{ color: 'black', fontWeight: 'bold', fontFamily: "cursive" }}>
        Features
      </Typography>
      <Grid container spacing={4} justifyContent="center" boxShadow={5} px={4} py={5}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card sx={{ height: '100%', border: '1px solid black', backgroundColor: '#F5F5F5' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ color: 'Black', fontFamily: 'cursive', fontWeight: 'bold' }}>{feature.title}</Typography>
                <Typography sx={{ color: 'black', fontFamily: 'serif' }}>{feature.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
export default function Home() {

  const featuresRef = useRef(null);
  const [openFreeDialog, setOpenFreeDialog] = useState(false);

  // Handle form submission. 
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
    window.location.href = "/generate"; // Redirect to the generate page
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
            <Typography variant="h6" sx={{ flexGrow: 1, fontFamily: 'cursive' }}>
              MemoGenie
            </Typography>
            <SignedOut>
              <Button sx={{ fontFamily: 'serif', fontWeight: 'bold' }} color="inherit" href="/sign-in">Login</Button>
              <Button sx={{ fontFamily: 'serif', fontWeight: 'bold' }} color="inherit" href='/sign-up'>Sign Up</Button>
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
            <Typography variant="h1" gutterBottom fontFamily={'cursive'}>Welcome to MemoGenie</Typography>
            <Typography variant="h6" gutterBottom fontFamily={'serif'}>
              MemoGenie is your AI-powered companion, turning any topic into personalized flashcards, making mastery effortless and engaging.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button component='a' variant="contained" sx={{ bgcolor: '#B088F9', color: 'white', fontFamily: 'serif' }} onClick={scrollToFeatures}>Get Started</Button>
            </Box>
          </Box>

          <Box sx={{
            position: 'absolute',
            right: 0,
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
        <FeaturesSection featuresRef={featuresRef} />

        {/* Pricing Section */}
        <section id="pricing">
          <Box sx={{ my: 6, textAlign: 'center', backgroundColor: 'purple', py: 6, px: 4 }}>
            <Typography variant="h4" align="center" gutterBottom sx={{ color: 'white', fontFamily: 'serif', fontWeight: 'bold' }}>
              Choose Your Plan
            </Typography>
            <Typography variant="h6" align="center" gutterBottom sx={{ color: 'white', mb: 4, fontFamily: 'serif' }}>
              Select the package that best fits your needs
            </Typography>
            <Grid container spacing={3} justifyContent="center">
              {[
                {
                  title: "Free",
                  subtitle: "Get started for free",
                  price: "$0",
                  period: "/month",
                  features: [
                    "Generate up to 3 flashcards",
                    "Basic AI-generated flashcards"
                  ],
                  buttonText: "Get Started",
                  onClick: handleFreeClick,
                },
                {
                  title: "Basic",
                  subtitle: "Unlock more features",
                  price: "$5",
                  period: "/month",
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
                  price: "$10",
                  period: "/month",
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
                      <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', fontFamily: 'serif' }}>
                        {plan.title}
                      </Typography>
                      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                        {plan.subtitle}
                      </Typography>
                      <Typography variant="h4" component="div" sx={{ my: 2, fontWeight: 'bold', fontFamily: 'serif' }}>
                        {plan.price}<span style={{ fontSize: '1rem' }}>{plan.period}</span>
                      </Typography>
                      <Box sx={{ mt: 2, mb: 2, flexGrow: 1 }}>
                        {plan.features.map((feature, idx) => (
                          <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Typography sx={{ mr: 1, color: '#00A3A3', fontFamily: 'serif' }}>✓</Typography>
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
                          width: '80%',
                          shadow: 10,
                          fontFamily: 'serif'

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
        </section>



        {/* Dialog for Free Plan */}
        <Dialog
          open={openFreeDialog}
          onClose={handleCloseFreeDialog}
          aria-labelledby="free-plan-dialog-title"
          aria-describedby="free-plan-dialog-description"
        >
          <DialogTitle id="free-plan-dialog-title" sx={{ fontWeight: 'bold', fontFamily: 'serif' }}>Free Plan</DialogTitle>
          <DialogContent>
            <DialogContentText id="free-plan-dialog-description" sx={{ fontFamily: 'serif' }}>
              You have selected the Free Plan. You can generate up to 3 flashcards per month. Enjoy using our app for free!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseFreeDialog} color="primary" sx={{ fontFamily: 'serif' }}>Cancel</Button>
            <Button variant='contained' onClick={handleContinue} color="primary" sx={{ fontFamily: 'serif' }} autoFocus>
              Continue
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}
