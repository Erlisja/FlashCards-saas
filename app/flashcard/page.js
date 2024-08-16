'use client'
import { AppBar, Container, Grid,Button, Box,Card, Typography,Toolbar, CardActionArea, CardContent} from "@mui/material";
import Link from "next/link";
import { useUser } from "@clerk/nextjs"
import { useEffect,useState } from "react"
import {collection, doc, writeBatch,getDocs} from "firebase/firestore";
import { db } from "@/firebase";
import { useSearchParams } from "next/navigation";

export default function Flashcard(){

const {isLoaded,isSignedIn,user} = useUser()
const [flashcards, setFlashcards] = useState([])
const [flipped, setFlipped] = useState([])

const searchParams = useSearchParams()
const search = searchParams.get('id')

useEffect(()=>{
    async function getFlashcard(){
        if (!user || !search) return
        const colRef = collection(doc(collection(db, 'users'), user.id),search)
        const docs = await getDocs(colRef);
        const flashcards = []

        docs.forEach((doc)=>{
            flashcards.push({id: doc.id, ...doc.data()})
        })
        setFlashcards(flashcards)
    }
    getFlashcard()
},[user,search])

const handleCardClick = (id)=>{
    setFlipped((prev) => ({
        ...prev,
        [id]: !prev[id]
    }))
}

if (!isLoaded || !isSignedIn) {return <></>}


return (
    <Container maxWidth='100vw' >
        <AppBar position="static" sx={{backgroundColor: '#3f51b5'}} >
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Flashcard Saas
                </Typography>
                <Button color="inherit">
                    <Link href="./flashcards" passHref>
                        Back
                    </Link>
                </Button>
                
            </Toolbar>
        </AppBar>
        <Grid container  maxWidth= '100vw' spacing={3} sx={{mt:4}}>
        
                    {flashcards.map((flashcard,index)=>(
                        <Grid item xs={12} sm={6} md={4} key={index} >
                            <Card>
                                <CardActionArea
                                onClick={()=>{handleCardClick(index)}}>
                                    <CardContent overflow='auto'>
                                        <Box 
                                        sx={{
                                            perspective: '1000px',
                                           '& > div': {

                                                transition: 'transform 0.6s',
                                                transformStyle: 'preserve-3d',
                                                transform : flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
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
                                                padding: 5,
                                                boxSizing: 'border-box',
                                             
                                             },
                                             '& > div > div:nth-child(2)': { 
                                                transform: 'rotateY(180deg)',
                                                backgroundColor: '#f5f5f5',
                                                color: 'black',
                                                padding: '20px',
                                                overflow: 'auto',
                                                fontSize: '0.5rem',
                                             },
                                            }}>
                                            <div>
                                                <div>
                                                <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '8px', marginTop:'8px' }}>
                                                {flashcard.topic}
                                                </Typography>
                                                     <Typography variant="h6" component='div'>
                                                            {flashcard.front}
                                                     </Typography>
                                                </div>
                                                <div>
                                                     <Typography variant="body2" component='div' overflow={'auto'}>
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
    </Container>
)
}


