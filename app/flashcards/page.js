// 'use client'
// import { SignOutButton, useUser,useClerk} from "@clerk/nextjs"
// import { AppBar, Container, Toolbar,Button, Typography, Grid,Card,CardActionArea,CardContent } from "@mui/material";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { use,useState,useEffect } from "react";
// import { collection, doc, writeBatch,getDoc,setDoc,CollectionReference} from "firebase/firestore";
// import { db } from "@/firebase";



// export default function Flashcards(){

//     const {isLoaded,isSignedIn,user} = useUser()
//     const [flashcards,setFlashcards] = useState([])
//     const router = useRouter()
//     const clerk = useClerk();  // Access Clerk client
    
//     useEffect(()=>{
//         async function getFlashcards(){
//             if (!user) return;
//             const userDocRef = doc(collection(db, 'users'), user.id);
//             const docSnap = await getDoc(userDocRef);
//             if (docSnap.exists()){
//                 const collections = docSnap.data().flashcards || [];
//                 setFlashcards(collections)
//             }
//             else {
//                 await setDoc(userDocRef, {flashcards: []})  
//             }
//         }
//         getFlashcards()
       
//     },[user])

//     if (!isLoaded || !isSignedIn) {return <></>}

//     const handleCardClick = (id)=>{
//         router.push(`/flashcard?id=${id}`)
//     }

//     const handleLogout = async () => {
       
//         await clerk.signOut();  // Sign out using Clerk
//         router.push('/');  // Redirect to sign-in page after logout
//     };

//     return (
//         <Container maxWidth='100vw' >
//             <AppBar position="static"  sx={{backgroundColor: '#3f51b5'}} >
//                 <Toolbar >
//                 <Link href="/" passHref>
//                     <Button sx={{ textTransform: 'none' }}>
//                         <Typography variant="h6" sx={{ flexGrow: 1, color: 'white' }}>
//                             Flashcard Saas
//                         </Typography>
//                     </Button>
//                 </Link>
//         <Button color="inherit" onClick={handleLogout}  sx={{ marginLeft: 'auto' }}  >
//             Logout
//         </Button>


     
//                 </Toolbar>
//             </AppBar>
//             <Grid container spacing={3} sx={{mt:4}}>
//                 {flashcards.map((flashcard,index)=>(
//                     <Grid item xs={12} sm={6} md={4} key={index}>
//                         <Card>
//                             <CardActionArea onClick={()=>handleCardClick(flashcard.name)}>
//                             <CardContent>
//                                 <Typography variant="h5" sx={{textAlign: 'center'}}>{flashcard.name}</Typography>
//                             </CardContent>
//                         </CardActionArea>
//                         </Card>
//                     </Grid>
//                 ))}

//                 </Grid>
            
           
//         </Container>
//     )
// }

'use client';
import { SignOutButton, useUser, useClerk } from "@clerk/nextjs";
import { AppBar, Container, Toolbar, Button, Typography, Grid, Card, CardActionArea, CardContent, IconButton, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { collection, doc, writeBatch, getDoc, setDoc, deleteDoc,docs } from "firebase/firestore";
import { db } from "@/firebase";
import HighlightOffSharpIcon from '@mui/icons-material/HighlightOffSharp';
import RemoveCircleTwoToneIcon from '@mui/icons-material/RemoveCircleTwoTone';

export default function Flashcards() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcardCollections, setFlashcardCollections] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCollection, setSelectedCollection] = useState(null);
    const router = useRouter();
    const clerk = useClerk();  // Access Clerk client

    useEffect(() => {
        async function getFlashcards() {
            if (!user) return;
            const userDocRef = doc(collection(db, 'users'), user.id);
            const docSnap = await getDoc(userDocRef);
            if (docSnap.exists()) {
                const collections = docSnap.data().flashcards || [];
                setFlashcardCollections(collections);
            } else {
                await setDoc(userDocRef, { flashcards: [] });
            }
        }
        getFlashcards();
    }, [user]);

    if (!isLoaded || !isSignedIn) {
        return <></>;
    }

    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`);
    };

    const handleLogout = async () => {
        await clerk.signOut();  // Sign out using Clerk
        router.push('./');  // Redirect to sign-in page after logout
    };

    const handleOpenDialog = (collection) => {
        setSelectedCollection(collection);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedCollection(null);
    };

    const handleDeleteCollection = async () => {
        if (!user || !selectedCollection) return;

        const userDocRef = doc(collection(db, 'users'), user.id);

        try {
            const docSnap = await getDoc(userDocRef);
            if (docSnap.exists()) {
                const collections = docSnap.data().flashcards || [];
                const updatedCollections = collections.filter(collection => collection.name !== selectedCollection.name);
                await setDoc(userDocRef, { flashcards: updatedCollections });
                setFlashcardCollections(updatedCollections);
            }
        } catch (error) {
            console.error("Error deleting collection: ", error);
        }

        setOpenDialog(false);
        setSelectedCollection(null);
    };

    return (
        <Container maxWidth='100vw'>
            <AppBar position="static" sx={{ backgroundColor: '#3f51b5' }}>
                <Toolbar>
                    <Link href="/" passHref>
                        <Button 
                        sx={{ textTransform: 'none' }} >
                            <Typography variant="h6" 
                            sx={{ flexGrow: 1, color: 'white'}}>
                                Flashcard Saas
                            </Typography>
                        </Button>
                    </Link>
                    <Button color="inherit" onClick={handleLogout} sx={{ marginLeft: 'auto' }}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>
            <Link href="./generate" passHref>
                        <Button variant="contained" sx={{m:2}} >
                                Back 
                        </Button>
                    </Link>
            <Grid container spacing={3} sx={{ mt: 4 }}>
                {flashcardCollections.map((collection, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index} sx={{ position: 'relative' }}>
                        <Card>
                            <CardActionArea onClick={() => handleCardClick(collection.name)}>
                                <CardContent>
                                    <Typography variant="h5" sx={{ textAlign: 'center' }}>{collection.name}</Typography>
                                </CardContent>
                            </CardActionArea>
                            <IconButton
                                sx={{ position: "absolute", top: 10, right: 10, color: 'red' }}
                                onClick={() => handleOpenDialog(collection)}
                            >
                                <RemoveCircleTwoToneIcon />
                            </IconButton>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
            >
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this collection?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
                    <Button onClick={handleDeleteCollection} color="secondary">Delete</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}