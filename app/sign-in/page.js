'use client'
import { SignIn } from "@clerk/nextjs";
import { AppBar, Container, Toolbar, Button, Box, Typography } from "@mui/material";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'White' }}>
      <AppBar position="fixed" sx={{ backgroundColor: 'purple', width: '100%' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            MemoGenie
          </Typography>
          <Button color="inherit">
            <Link href="/" passHref>
              Home
            </Link>
          </Button>
          <Button color="inherit">
            <Link href="/sign-up" passHref>
              Sign Up
            </Link>
          </Button>
        </Toolbar>
      </AppBar>
      <Container
        sx={{
          flexGrow: 1,
          pt: 8, // Adjust padding-top to account for the fixed AppBar
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
