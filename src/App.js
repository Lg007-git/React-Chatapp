import {Box,Button,Container,VStack,Input,HStack,Avatar, Grid,Icon,useClipboard,useToast} from "@chakra-ui/react";  
import {onAuthStateChanged, getAuth,GoogleAuthProvider,signInWithPopup,signOut} from 'firebase/auth';
import {react,useState,useEffect,useRef} from "react";
import {getFirestore,addDoc,collection,serverTimestamp,onSnapshot,query,orderBy} from "firebase/firestore";
import Message from "./component/Message";
import {app} from "./component/firebase";
import loginBgImage from './images/login1f.jpg';
import chatBgImage from './images/snapedit_1726064475947.jpg';
import { FaUserPlus,FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

const auth=getAuth(app);
const db=getFirestore(app);

const loginHandler =()=>{
  const provider=new GoogleAuthProvider();
  signInWithPopup(auth,provider);
};

const logoutHandler=()=>{
  signOut(auth);
}


function App() {
  
  const [user,setUser]=useState(false);
  const [message,setMessage]=useState("");
  const [messages,setMessages]= useState([]);

  const divForScroll=useRef(null);

  const toast = useToast(); // For showing pop-up notifications
  const { onCopy } = useClipboard(window.location.href); // Clipboard hook


  const submitHandler =async(e)=>{
    e.preventDefault();
    try{  
      setMessage("");
      await addDoc(collection(db,"Messages"),{
        text:message,
        uid:user.uid,
        uri:user.photoURL,
        createAt:serverTimestamp(),
      })
      
      divForScroll.current.scrollIntoView({behavior:"smooth"})
  
    }catch(error){
      alert(error);
    }
  }

  const copyToClipboard = () => {
    onCopy();
    toast({
      title: "Link copied to clipboard.",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "bottom-right",
    });
  };

  useEffect(()=>{
    const q=query(collection(db,"Messages"),orderBy("createAt","asc")); 

    const unsubscribe=onAuthStateChanged(auth,(data)=>{
      setUser(data);
    }); 

   const unsubscribeForMessage= onSnapshot(q,(snap)=>{
        setMessages(
          snap.docs.map((item)=>{
            const id =item.id;
            return{id,...item.data()};
          })
        );
    }); 
    return()=>{
      unsubscribe();
      unsubscribeForMessage();
    }
  },[])
  

  return (
    <Box  bgImage={`url(${user ? chatBgImage : loginBgImage})`} 
    bgSize="cover"
    bgPosition="center"
    
    w="100%"
    h="100%">
      {
    user?
    (
      
      <Container h={"100vh"} bg={"rgba(215, 213, 218, 0.5)"} >
         <VStack h="full" paddingY={"4"} >   {/* div with display as flex  and flex direction colomn */}
        
          <Button onClick={logoutHandler} colorScheme={"red"} w={"full"}>
            Logout
          </Button>
          <VStack h={"full"} w="full" overflowY="auto" css={{"&::-webkit-scrollbar" :{display:"none"}}}>
           { messages.map((item) => (
              <Message key={item.id} user={item.uid ===user.uid ?"me":"other"} text={item.text} uri={item.uri} />
            ))
            }

          </VStack>
          <form onSubmit={submitHandler} style={{width:"100%" }}>
            <HStack>
            <Input value={message} onChange={(e)=>setMessage(e.target.value)} placeholder="Enter a message.."/>
            <Button colorScheme={"purple"} type="Submit">Send</Button>
            </HStack>
          </form>
          <div ref={divForScroll}></div>
          
        </VStack>
       
      </Container>
      
    ) :
    (<VStack justifyContent={"center"} h="100vh">
    
<Grid
  display="flex"
  bg="rgba(2, 26, 57, 0.6)"
  p={10}
  m={8}
  borderRadius="md"
  boxShadow="md"
  flexDirection="column"
  justifyContent="center"
  alignItems="center"
  textAlign="center"
  gap={4}
  backdropFilter="blur(10px)"
  border="1px solid rgba(255, 255, 255, 0.2)"
>
  <Avatar src="https://invalid-url.com" boxSize="150px" /> 
  
  <Button onClick={loginHandler} colorScheme="purple" > <HStack spacing={2}> <FcGoogle  /> <span>Sign In With Google </span></HStack></Button>
  <Button onClick={loginHandler} colorScheme="purple" > <HStack spacing={2}>  <FaGithub /> <span>Sign In With GitHub </span></HStack> </Button>
  <Button onClick={copyToClipboard} colorScheme="teal" w="full"leftIcon={<FaUserPlus />}>  Invite your Friends</Button>
</Grid>

     
    </VStack>
    )}
    </Box>
  );
}

export default App;
