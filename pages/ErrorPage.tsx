import { Alert, AlertIcon, AlertTitle, AlertDescription, CloseButton } from "@chakra-ui/react"
import router from "next/router"
import React from "react"

const ErrorPage: React.FunctionComponent<{ message: String }> = ({ message }) => {
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
                    router.push({
                        pathname: "/setting",
                    })
                }}
            />
        </Alert>
    )
}

export default ErrorPage
