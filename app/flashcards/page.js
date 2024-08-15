'use client'
import { useUser } from "@clerk/nextjs"
import { AppBar, Container, Toolbar,Button, Typography, Grid,Card,CardActionArea,CardContent } from "@mui/material";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { use,useState,useEffect } from "react";
import { collection, doc, writeBatch,getDoc,setDoc,CollectionReference} from "firebase/firestore";
import { db } from "@/firebase";

export default function Flashcards(){
    const {isLoaded,isSignedIn,user} = useUser()
    const [flashcards,setFlashcards] = useState([])
    const router = useRouter()


    useEffect(()=>{
        async function getFlashcards(){
            if (!user) return;
            const userDocRef = doc(collection(db, 'users'), user.id);
            const docSnap = await getDoc(userDocRef);
            if (docSnap.exists()){
                const collections = docSnap.data().flashcards || [];
                setFlashcards(collections)
            }
            else {
                await setDoc(userDocRef, {flashcards: []})  
            }
        }
        getFlashcards()
       
    },[user])

    if (!isLoaded || !isSignedIn) {return <></>}

    const handleCardClick = (id)=>{
        router.push(`/flashcards/${id}`)
    }



    return (
        <Container maxWidth='100vw' >
            <AppBar position="static" sx={{backgroundColor: '#3f51b5'}} >
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Flashcard Saas
                    </Typography>
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
            <Grid container spacing={3} sx={{mt:4}}>
                {flashcards.map((flashcard,index)=>(
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card>
                            <CardActionArea onClick={()=>handleCardClick(flashcard.id)}>
                            <CardContent>
                                <Typography variant="h5" sx={{textAlign: 'center'}}>{flashcard.name}</Typography>
                            </CardContent>
                        </CardActionArea>
                        </Card>
                    </Grid>
                ))}

                </Grid>
            
           
        </Container>
    )
}

