'use client'
import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import Head from "next/head"; // Correctly import Head from next/head
import { SignedIn,SignedOut,UserButton } from "@clerk/nextjs";
import {Box, AppBar, Button, Container, Toolbar, Typography, Grid,Dialog,DialogActions,DialogContent,DialogContentText,DialogTitle } from "@mui/material";
import { useRef, useState} from "react";

export default function Home() {

  const [openFreeDialog, setOpenFreeDialog] = useState(false);

  // const handleSubmit = async () => {
  //   const checkoutSession = await fetch("/api/checkout_session", {
  //     method: "POST",
  //     headers: {
  //       origin: 'http://localhost:3000',
  //     },
  //   })
  //   const checkout_session = await checkoutSession.json();

  //   if (checkoutSession.statusCode === 500) {
  //     console.error(checkout_session.message);
  //     return;
  //   }

  //   const stripe = await getStripe();
  //   const { error } = await stripe.redirectToCheckout({
  //     sessionId: checkout_session.id,
  //   });

  //   if (error) {
  //     console.warn(error.message);  
  //   }
  // }
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

    <Container maxWidth='100%'>
      <Head>
        <title>Flashcard Creator</title>
        <meta name="description" content="create flashcard from your text" />
      </Head>

      <AppBar position="static">
        <Toolbar>
          
          <Typography variant="h5"  sx={{ flexGrow: 1 }}>
            Flashcard Saas
          </Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in">Login</Button>
            <Button color= "inherit" href='/sign-up'>Sign Up</Button>
          </SignedOut>
          <SignedIn >
            <UserButton/>
          </SignedIn>
          </Toolbar>
        </AppBar>
        <Box sx={
          {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '90vh'
          }
        }>
          <Typography variant="h2" gutterBottom>Welcome to Flashcard Saas</Typography>
          <Typography variant="h5" gutterBottom>
            {' '}
            The easiest way to make flashcards from text</Typography>
            <Button component='a' variant="contained" color="primary" sx={{mt:2}} onClick={scrollToFeatures}>Get Started</Button>
        </Box>
        <section id="features" ref={featuresRef}>
        <Box sx={{my:20, alignContent:'center'}} maxHeight={'80vh'} >
          <Typography variant="h3" align="center" mb={15}>Features </Typography>
          
          <Grid container spacing={4}> 
            <Grid item xs={12} md={4}>
              <Typography variant="h5">Smart Flashcards</Typography>
              <Typography>
                {' '}
                Create flashcards from any text in seconds. 
                Creating flashcards has never been easier.
                Simply paste your text and let us do the rest.
              </Typography>
          </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h5">AI powered generator </Typography>
              <Typography>
                {' '}
                Our AI-powered flashcard generator will create flashcards from any text in seconds, 
                perfect for studying and memorizing information.
                
              </Typography>
          </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h5">Accessible Anywhere</Typography>
              <Typography>
                {' '}
                Access your flashcards from anywhere, on any device.
                Our cloud-based platform ensures that your flashcards are always available when you need them.
              </Typography>
          </Grid>
          </Grid>
        </Box>
         <Box sx={{my:6, textAlign:'center'}}>
         <Typography variant="h4" align="center" gutterBottom>Pricing</Typography>
         <Grid container spacing={4}> 
            <Grid item xs={12} md={4}>
              <Box sx={{ p:3, border: '1px solid', borderColor: 'white', borderRadius: 4 }}>
                <Typography variant="h5" gutterBottom>Free</Typography>
                <Typography variant="h6" gutterBottom>$0 / month</Typography>
                <Typography>Create up to 3 flashcards per month.</Typography>
               <Button variant="contained" color="primary" sx={{ mt:2 }} onClick={handleFreeClick}>Choose Free</Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ p:3, border: '1px solid', borderColor: 'white', borderRadius: 4 }}>
                <Typography variant="h5" gutterBottom>Basic</Typography>
                <Typography variant="h6" gutterBottom>$5 / month</Typography>
                <Typography>Create up to 100 flashcards per month. Limited storage.</Typography>
                <Button variant="contained" color="primary" sx={{ mt:2 }} onClick={() => handleSubmit('basic')}>Choose Basic</Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ p:3, border: '1px solid', borderColor: "white", borderRadius: 4 }}>
                <Typography variant="h5" gutterBottom>Pro</Typography>
                <Typography variant="h6" gutterBottom>$10 / month</Typography>
                <Typography>Unlimited flashcards and storage. Priority support.</Typography>
                <Button variant="contained" color="primary" sx={{ mt:2 }} onClick={() => handleSubmit('pro')}>Choose Pro</Button>
              </Box>
            </Grid>
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
  </Container>
  );
}
