import React from 'react';
import styled from 'styled-components/native';
import { ScrollView, TouchableOpacity } from 'react-native';

import { image185 } from '../apis/movies';

const Container = styled.View`
  margin-top: 24px;
  margin-bottom: 24px;
`;

const Title = styled.Text`
  color: #fff;
  font-size: 18px;
  margin-left: 16px;
  margin-bottom: 20px;
`;

const CastContainer = styled(ScrollView)`
  padding: 0px 16px;
`;

const CastItem = styled(TouchableOpacity)`
  margin-right: 16px;
  align-items: center;
`;

const CastImageContainer = styled.View`
  overflow: hidden;
  border-radius: 40px;
  height: 80px;
  width: 80px;
  align-items: center;
  border: 1px solid #6b7280;
`;

const CastImage = styled.Image`
  border-radius: 10px;
  height: 96px;
  width: 80px;
`;

const CharacterText = styled.Text`
  color: #fff;
  font-size: 12px;
  margin-top: 4px;
`;

const NameText = styled.Text`
  color: #9ca3af;
  font-size: 12px;
`;

const Cast = ({ cast }) => {
  return (
    <Container>
      <Title>Top Cast</Title>
      <CastContainer horizontal showsHorizontalScrollIndicator={false}>
        {cast &&
          cast.map((person, index) => (
            <CastItem key={index}>
              <CastImageContainer>
                <CastImage source={{ uri: image185(person?.profile_path) }} />
              </CastImageContainer>
              <CharacterText>
                {person?.character.length > 10 ? `${person.character.slice(0, 10)}...` : person.character}
              </CharacterText>
              <NameText>
                {person?.original_name.length > 10 ? `${person.original_name.slice(0, 10)}...` : person.original_name}
              </NameText>
            </CastItem>
          ))}
      </CastContainer>
    </Container>
  );
}

export default Cast;