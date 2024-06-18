import React from 'react';
import { Dimensions } from 'react-native';
import styled from 'styled-components/native';
import * as Progress from 'react-native-progress';

const { width, height } = Dimensions.get('window');

const Container = styled.View`
  position: absolute;
  width: ${width}px;
  height: ${height}px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const Loading = () => {
    return (
        <Container>
            <Progress.CircleSnail thickness={4} size={80} />
        </Container>
    );
}

export default Loading