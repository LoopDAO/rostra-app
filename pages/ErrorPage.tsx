import { Alert, AlertIcon, AlertTitle, AlertDescription, CloseButton } from "@chakra-ui/react"
import router from "next/router"
import React from "react"
import { FaWindows } from "react-icons/fa"

const ErrorPage: React.FunctionComponent<{ message: String ,replaceUrl:string|URL}> = ({ message,replaceUrl }) => {
    return (
        <Alert status="error">
            <AlertIcon />
            <AlertTitle mr={2}>Error</AlertTitle>
            <AlertDescription>{message}.</AlertDescription>
            <CloseButton
                position="absolute"
                right="8px"
                top="8px"
                onClick={() => {
                    window.location.replace(replaceUrl)
                    // router.push({
                    //     pathname: "/setting",
                    // })
                }}
            />
        </Alert>
    )
}

export default ErrorPage
