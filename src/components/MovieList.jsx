import React from 'react';
import { Dimensions } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import { image185 } from '../apis/movies';

const { width, height } = Dimensions.get('window');

const Container = styled.View`
  margin-bottom: 32px;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-left: 16px;
  margin-right: 16px;
`;

const TitleText = styled.Text`
  font-size: 24px;
  color: #007AFF;
  padding-bottom: 10px;
`;

const MovieRow = styled.ScrollView`
  padding-left: 15px;
  padding-right: 15px;
`;

const MovieItemContainer = styled.View`
  margin-bottom: 16px;
  margin-right: 16px;
`;

const MoviePoster = styled.Image`
  border-radius: 24px;
`;

const MovieTitle = styled.Text`
  margin-left: 4px;
  font-weight: 400;
  color: #007AFF;
`;

const MovieList = ({ title, data }) => {
  const navigation = useNavigation();

  return (
    <Container>
      <Header>
        <TitleText>{title}</TitleText>
      </Header>

      <MovieRow horizontal showsHorizontalScrollIndicator={false}>
        {data.map((item, index) => (
          <TouchableWithoutFeedback key={index} onPress={() => navigation.push('Movie', item)}>
            <MovieItemContainer>
              <MoviePoster
                source={{ uri: image185(item.poster_path) }}
                style={{
                  width: width * 0.33,
                  height: height * 0.22,
                }}
              />
              <MovieTitle>
                {item.title.length > 14 ? `${item.title.slice(0, 14)}...` : item.title}
              </MovieTitle>
            </MovieItemContainer>

          </TouchableWithoutFeedback>
        ))}
      </MovieRow>
    </Container>
  );
}

export default MovieList;