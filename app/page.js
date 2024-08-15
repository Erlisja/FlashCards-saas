'use client'
import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import Head from "next/head"; // Correctly import Head from next/head
import { SignedIn,SignedOut,UserButton } from "@clerk/nextjs";
import {Box, AppBar, Button, Container, Toolbar, Typography, Grid } from "@mui/material";
export default function Home() {

  return (

    <Container maxWidth='lg'>
      <Head>
        <title>Flashcard Creator</title>
        <meta name="description" content="create flashcard from your text" />
      </Head>

      <AppBar position="static">
        <Toolbar>
          
          <Typography variant="h6"  sx={{ flexGrow: 1 }}>
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
            height: '80vh'
          }
        }>
          <Typography variant="h2" gutterBottom>Welcome to Flashcard Saas</Typography>
          <Typography variant="h5" gutterBottom>
            {' '}
            The easiest way to make flashcards from text</Typography>
            <Button variant="contained" color="primary" sx={{mt:2}}>Get Started</Button>
        </Box>
        <Box sx={{my:6, alignContent:'center'}} >
          <Typography variant="h4" align="center" gutterBottom>Features </Typography>
          
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
            <Grid item xs={12} md={6}>
              <Box sx={{p:3, 
                border: '1px solid ',
                borderColor: 'grey.300',
                borderRadius: 2,

               }}>
              <Typography variant="h5" gutterBottom>Basic</Typography>
              <Typography variant="h6" gutterBottom>$5 / month</Typography>
              <Typography>
                {' '}
               Create up to 100 flashcards per month. Limited storage.
              </Typography>
              <Button variant="contained" color="primary" sx={{mt:2}}>Choose Basic</Button>
              </Box>
          </Grid>
        
          
            <Grid item xs={12} md={6}>
            <Box sx={{p:3, 
                border: '1px solid ',
                borderColor: 'grey.300',
                borderRadius: 2,
               }}>
              <Typography variant="h5" gutterBottom>Pro</Typography>
              <Typography variant="h6" gutterBottom>$6 / month</Typography>
              <Typography>
                {' '}
                Unlimited flashcards and storage. Priority support.
              </Typography>
              <Button variant="contained" color="primary" sx={{mt:2}}> Choose Pro</Button>
              </Box>
              </Grid>
          </Grid>
        </Box>
  </Container>
  );
}
