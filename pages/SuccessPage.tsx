import { Alert, AlertIcon, AlertTitle, AlertDescription, CloseButton } from "@chakra-ui/react"
import { useTranslation } from "next-i18next"
import router from "next/router"
import React from "react"

const SuccessPage: React.FunctionComponent<{ title: String; message: String }> = ({ title, message }) => {
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
                {t(title)}
            </AlertTitle>
            <AlertDescription maxWidth="sm">{t(message)}.</AlertDescription>
        </Alert>
    )
}

export default SuccessPage
