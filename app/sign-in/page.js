// This is the page that will be displayed when the user navigates to /sign-in
'use client'
import { SignIn } from "@clerk/nextjs";
import { FormatColorText } from "@mui/icons-material";
import { AppBar, Container, Toolbar, Button, Box, Typography, colors } from "@mui/material";
import App from "next/app";
import Link from "next/link";


export default function SignInPage() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'White' }}>
      <AppBar position="fixed" sx={{ backgroundColor: 'purple', width: '100%' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            MemoGenie
          </Typography>

          <Link href="/"  >
            <Button
              sx={{ color: 'white' }}>
              Home
            </Button>
          </Link>
          <Link href="/sign-up" passHref>
            <Button sx={{ color: 'white' }}>
              Sign Up
            </Button>
          </Link>
        </Toolbar>
      </AppBar>
      <Container
        sx={{
          flexGrow: 1,
          pt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Sign In
        </Typography>
        <SignIn routing="hash" />
      </Container>
    </Box>
  );
}