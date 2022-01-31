import React, { useRef, ReactNode, useState } from "react"
import { Flex, Button, } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { GetStaticPaths, GetStaticProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useWeb3React } from "@web3-react/core"
import { Web3Provider } from "@ethersproject/providers"
import { getNftManagerContract } from "@lib/utils/contracts"
import { useTranslation } from "next-i18next"

export default function FormikExample() {
    const { t } = useTranslation()
    const { query } = useRouter()
    console.log('query: ', query)
    const { guildId, nftId } = query;
    console.log("guildId: ", guildId)
    console.log("nftId: ", nftId)

    const { account, library, chainId } = useWeb3React<Web3Provider>()
    const onSubmit = async () => {
        if (!library || !account) return
        const signer = await library.getSigner(account)
        const nftManager = getNftManagerContract(signer, chainId)
        if (!nftManager) return

        await nftManager.connect(signer).claimRedpacket(guildId, nftId);
    }

    return (
        <>
            <Flex>
                <Button
                    mt={4}
                    colorScheme="teal"
                    onClick={onSubmit}
                >
                    {t("redpacket.claim")}
                </Button>
            </Flex>
        </>
    )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale!, ["common"])),
        },
    }
}


export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {

    return {
        paths: [], //indicates that no page needs be created at build time
        fallback: 'blocking' //indicates the type of fallback
    }
}