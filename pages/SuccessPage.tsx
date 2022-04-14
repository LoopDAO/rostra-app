import { Alert, AlertIcon, AlertTitle, AlertDescription, CloseButton } from "@chakra-ui/react"
import { useTranslation } from "next-i18next"
import router from "next/router"
import React from "react"

const SuccessPage: React.FunctionComponent<{ title: String; message: String ,replaceUrl:string|URL}> = ({ title, message,replaceUrl }) => {
    const { t } = useTranslation()

    return (
        <Alert
            status="success"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            height="200px"
        >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
                {title}
            </AlertTitle>
            <AlertDescription maxWidth="sm">{message}.</AlertDescription>
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

export default SuccessPage
