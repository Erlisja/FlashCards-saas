'use client'
import { SignOutButton, useUser,useClerk} from "@clerk/nextjs"
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
    const clerk = useClerk();  // Access Clerk client
    
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
        router.push(`/flashcard?id=${id}`)
    }

    const handleLogout = async () => {
       
        await clerk.signOut();  // Sign out using Clerk
        router.push('/');  // Redirect to sign-in page after logout
    };

    return (
        <Container maxWidth='100vw' >
            <AppBar position="static"  sx={{backgroundColor: '#3f51b5'}} >
                <Toolbar >
                <Link href="/" passHref>
                    <Button sx={{ textTransform: 'none' }}>
                        <Typography variant="h6" sx={{ flexGrow: 1, color: 'white' }}>
                            Flashcard Saas
                        </Typography>
                    </Button>
                </Link>
        <Button color="inherit" onClick={handleLogout}  sx={{ marginLeft: 'auto' }}  >
            Logout
        </Button>


     
                </Toolbar>
            </AppBar>
            <Grid container spacing={3} sx={{mt:4}}>
                {flashcards.map((flashcard,index)=>(
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card>
                            <CardActionArea onClick={()=>handleCardClick(flashcard.name)}>
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

