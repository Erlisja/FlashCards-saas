'use client'
import { useUser } from "@clerk/nextjs"
import { AppBar, Container, Grid,Button, Box,Card, Typography, Toolbar, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, CardActionArea, CardContent} from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, doc, writeBatch,getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import Link from "next/link";


export default function Generate(){
    const {isLoaded,isSignedIn,user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState([])
    const [text, setText] = useState("")
    const[name, setName] = useState("")
    const[open, setOpen] = useState(false)
    const router = useRouter()

    const handleSubmit = async()=>{
        fetch ('api/generate', {
            method: 'POST',
            body: text,
          
        })
        .then((res) => res.json())
        .then((data) => 
            setFlashcards(data))
            
        }
          

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

    const saveFlashcards = async()=>{
        if (!name){
            alert("Please enter a name for the flashcards")
            return;
        }

        const batch = writeBatch(db);
        const userDocRef = doc(collection(db, 'users'), user.id);
        const docSnap = await getDoc(userDocRef);

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
                    label="Flashcard Name" />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={saveFlashcards} color="primary">Save</Button>
            </DialogActions>
        </Dialog>
    </Container>
    </Box>
</>
);
}