import React from 'react'
import {HStack,Avatar,Text} from "@chakra-ui/react";

const Message=({text,uri,user="other"})=> {
  return (
    <HStack  alignSelf={user==="me" ? "flex-end" : "flex-start" } bg="grey.100" borderRadius={"base"} paddingY="2" paddingX={user==="me" ? "4" :"2"}>
        {
            user==="other"&&  <Avatar src={uri} />
           //img tag with round borders
        } 
        <Text>{text}</Text>
        {
            user==="me"&&  <Avatar src={uri} />
           //img tag with round borders
        }       
    </HStack>
  )
}   

export default Message