import { GetStaticProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import Hero from '../components/Home/Hero'
import Features from "../components/Home/Features"

export default function IndexPage() {
  return (
    <>
      <Hero />
      <Features />
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
