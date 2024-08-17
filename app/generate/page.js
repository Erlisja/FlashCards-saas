'use client'
import { useUser } from "@clerk/nextjs"
import { AppBar, Container, Grid,Button, Box,Card,Toolbar,Typography, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, CardActionArea, CardContent} from "@mui/material";
import { useState, useRef} from "react";
import { useRouter } from "next/navigation";
import { collection, doc, writeBatch,getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import Link from "next/link";
import { Timer } from "@mui/icons-material";

// Main component for generating flashcards
export default function Generate(){
    const {isLoaded,isSignedIn,user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState([])
    const [text, setText] = useState("")
    const[name, setName] = useState("")
    const[open, setOpen] = useState(false)
    const [limitReached, setLimitReached] = useState(false);
    const [generationCount, setGenerationCount] = useState(0); // Add this state

    const router = useRouter()

     // Function to check the number of flashcards
     const checkFlashcardLimit = async () => {
        const userDocRef = doc(collection(db, 'users'), user.id);
        const colRef = collection(userDocRef, name);
        const snapshot = await getDoc(colRef);
        return snapshot.size;
    };

    const handleSubscriptionClose = () => {
        setLimitReached(false); // Close the subscription popup
    };


    // Function to handle form submission for generating flashcards
    const handleSubmit = async()=>{
        
        if (generationCount >= 3) {
            setLimitReached(true); // Show the popup if limit reached
            return;
        }
        fetch ('api/generate', { 
            method: 'POST',         // HTTP method
            body: text,             // Request body containing the input text
          
        })
        .then((res) => res.json())  // Parse the response as JSON
        .then((data) => 
            setFlashcards(data)) // Update the flashcards state with the response data
        setGenerationCount(prevCount => prevCount + 1);   
            
        }
          
    // Function to handle the click event on a flashcard
    const handleCardClick = (id)=>{
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id]
        }))
    }
    const handleOpen = ()=>{
        setOpen(true);
    }

    const handleClose = ()=>{
        setOpen(false);
    }

    const handleRedirectToSubscription = () => {
        router.push('/#features');
    };

    // Function to save the flashcards to the database
    const saveFlashcards = async()=>{
        if (!name){
            alert("Please enter a name for the flashcards")
            return;
        }

        const batch = writeBatch(db);
        const userDocRef = doc(collection(db, 'users'), user.id);
        const docSnap = await getDoc(userDocRef);

        let flashcardCount = 0;

        if (docSnap.exists()){
           const collections = docSnap.data().flashcards;
           if (collections.find((f)=>f.name === name)){
               alert("You already have a set of flashcards with that name")
               return;
           }else {
            collection.push({
                name
            }) 
            batch.set(userDocRef, {flashcards: collections}, {merge: true})
        }
    }else{
        batch.set(userDocRef, {flashcards: [{name}]})
    }

    const colref = collection(userDocRef, name);
    flashcards.forEach((flashcard)=>{
        const cardDocRef = doc(colref);
        batch.set(cardDocRef, flashcard)
        flashcardCount += 1;
    })
    await batch.commit();
    handleClose();
    router.push('/flashcards');  
    }
    return (
    <>
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
                <Link href="/sign-in" passHref>
                    Login
                </Link>
            </Button>
            <Button color="inherit">
                <Link href="/sign-up" passHref>
                    Sign Up
                </Link>
            </Button>
        </Toolbar>
    </AppBar>
    <Container maxWidth='md' sx={{ pt: 8 }}>
        <Box
            sx={{
                mt: 4,
                mb: 6,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            
            }}>
            <Typography variant="h4">Generate Flashcards</Typography>
            <Paper color='black' sx={{ p: 4, width: '100%', mt: 6 }}>
                <TextField
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    multiline
                    rows={4}
                    fullWidth
                    variant="outlined"
                    sx={{ mb: '4' }}
                    label="Paste text here" />
                <Button sx={{ mt: 2 }} fullWidth variant="contained" color="primary" onClick={handleSubmit}>{' '}Generate</Button>
            </Paper>
        </Box>

        {flashcards.length > 0 && (
            <Box sx={{ mt: 4 }}>
                <Typography variant="h5" align="center" sx={{ p: 5 }}>Flashcards Preview</Typography>
                <Grid container spacing={3} maxHeight={'100%'} maxWidth={'100%'}>
                    {flashcards.map((flashcard, id) => (
                        <Grid item xs={12} sm={6} md={4} key={id}>
                            <Card>
                                <CardActionArea
                                    onClick={() => { handleCardClick(id) }}>
                                    <CardContent>
                                        <Box
                                            sx={{
                                                perspective: '1000px',
                                                '& > div': {
                                                    transition: 'transform 0.6s',
                                                    transformStyle: 'preserve-3d',
                                                    transform: flipped[id] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                                    position: 'relative',
                                                    width: '100%',
                                                    height: '200px',
                                                    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                                                    borderRadius: '8px',
                                                    display: 'flex',
                                                },
                                                '& > div > div': {
                                                    backfaceVisibility: 'hidden',
                                                    position: 'absolute',
                                                    height: '100%',
                                                    width: '100%',
                                                    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                                                    borderRadius: '8px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    padding: 2,
                                                    boxSizing: 'border-box',
                                                },
                                                '& > div > div:nth-child(2)': {
                                                    transform: 'rotateY(180deg)',
                                                    backgroundColor: '#f5f5f5',
                                                    color: 'black',
                                                    padding: '20px',
                                                    overflowY: 'auto',
                                                    fontSize: '0.9rem',
                                                },
                                            }}>
                                            <div>
                                                <div>
                                                    <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '8px' }}>
                                                        {flashcard.topic}
                                                    </Typography>
                                                    <Typography variant="h6" component='div'>
                                                        {flashcard.front}
                                                    </Typography>
                                                </div>
                                                <div>
                                                    <Typography variant="body1" component='div'>
                                                        {flashcard.back}
                                                    </Typography>
                                                </div>
                                            </div>
                                        </Box>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                    <Button variant="contained" color="primary" onClick={handleOpen}>
                        Save
                    </Button>
                </Box>
            </Box>
        )}
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Save Flashcards</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Enter a name for the flashcard collection
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    variant="outlined"
                    label="Flashcard Name"/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={saveFlashcards} color="primary">Save</Button>
                </DialogActions>
            </Dialog>
             {/* Subscription popup dialog */}
             <Dialog open={limitReached} onClose={handleSubscriptionClose}>
                <DialogTitle sx={{ textAlign: 'center', fontSize: '1.5rem' }}>Subscription Required</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            You've reached the limit of free flashcard generations.
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            To continue generating flashcards, please choose one of our subscription plans:
                        </Typography>
                        <ul>
                            <li><Typography variant="body2">Basic Plan: $5/month - Up to 100 flashcards/month, limited storage</Typography></li>
                            <li><Typography variant="body2">Pro Plan: $10/month - Unlimited flashcards and storage, priority support</Typography></li>
                        </ul>
                        <Typography variant="body1">
                            Click below to view and select a subscription plan.
                        </Typography>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSubscriptionClose}>Close</Button>
                    <Button onClick={handleRedirectToSubscription} color="primary">View Subscriptions</Button>
                </DialogActions>
            </Dialog>
         </Container>
    )
}



