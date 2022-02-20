import { Spinner } from '@chakra-ui/react';
import { styled } from 'stitches.config';

export default function Loading () {

    const LoadingDiv = styled('div', {
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '100px'
    })
    const LoadingText = styled('div', {
        marginLeft: '20px'
    })
    return (
        <LoadingDiv>
            <Spinner />
            <LoadingText>loading...</LoadingText>
        </LoadingDiv>
    )
}