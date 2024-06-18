import React, { useState, useEffect, useRef } from 'react';
import { Alert, Text, FlatList } from 'react-native';
import styled from 'styled-components/native';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { getGenres } from '../apis/genre';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 16px;
  background-color: #fff;
`;

const InputContainer = styled.View`
  width: 100%;
  margin-bottom: 16px;
`;

const Label = styled.Text`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #333;
`;

const Input = styled.TextInput`
  border: 1px solid #ccc;
  padding: 8px;
  width: 100%;
  border-radius: 4px;
`;

const ButtonContainer = styled.View`
  width: 100%;
  margin-top: 16px;
`;

const StyledButton = styled.TouchableOpacity`
  background-color: #ff6600;
  padding: 12px;
  align-items: center;
  border-radius: 4px;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;

const TermsText = styled.Text`
  color: #333;
  font-size: 12px;
  margin-top: 8px;
  text-align: center;
`;

const LinkText = styled.Text`
  color: #ff6600;
  text-decoration: underline;
`;

const BottomSheetContainer = styled.View`
  background-color: #f5f5f5;
  flex: 1;
  padding: 16px;
`;

const CloseButton = styled.TouchableOpacity`
  align-self: flex-end;
  padding: 8px;
`;

const CloseButtonText = styled.Text`
  color: #ff6600;
  font-size: 16px;
  font-weight: bold;
`;

const GenreItem = styled.TouchableOpacity`
  flex: 1;
  padding: 10px;
  margin: 5px;
  background-color: ${(props) => (props.selected ? '#d3d3d3' : '#fff')};
  border-radius: 5px;
  align-items: center;
`;

const Login = () => {
  const [username, setUsername] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [genres, setGenres] = useState([]);
  const bottomSheetRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genreList = await getGenres();
        setGenres(genreList);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, []);

  const handleGenreSelect = (genre) => {
    setSelectedGenres((prevGenres) =>
      prevGenres.some((g) => g.id === genre.id)
        ? prevGenres.filter((g) => g.id !== genre.id)
        : [...prevGenres, genre]
    );
  };

  const handleLogin = async () => {
    if (username && selectedGenres.length > 0) {
      try {
        await AsyncStorage.setItem('username', username);
        await AsyncStorage.setItem('selectedGenres', JSON.stringify(selectedGenres));
        navigation.navigate('Dashboard');
      } catch (error) {
        console.error('Error storing data:', error);
      }
    } else {
      Alert.alert('Error', 'Please enter a username and select at least one genre.');
    }
  };

  return (
    <Container>
      <InputContainer>
        <Label>Enter your username</Label>
        <Input
          placeholder="Enter your username"
          value={username}
          onChangeText={setUsername}
        />
      </InputContainer>
      <ButtonContainer>
        <StyledButton onPress={() => bottomSheetRef.current.expand()}>
          <ButtonText>Select Genres</ButtonText>
        </StyledButton>
      </ButtonContainer>
      <ButtonContainer>
        <StyledButton onPress={handleLogin}>
          <ButtonText>Login</ButtonText>
        </StyledButton>
      </ButtonContainer>
      <TermsText>
        By clicking, I accept the <LinkText>terms of service</LinkText> and <LinkText>privacy policy</LinkText>
      </TermsText>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={[1, '85%']}
        initialSnapIndex={0}
        enablePanDownToClose={true}
        backdropComponent={BottomSheetBackdrop}
      >
        <BottomSheetContainer>
          <CloseButton onPress={() => bottomSheetRef.current.close()}>
            <CloseButtonText>Close</CloseButtonText>
          </CloseButton>
          <FlatList
            data={genres}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            renderItem={({ item }) => (
              <GenreItem
                selected={selectedGenres.some((g) => g.id === item.id)}
                onPress={() => handleGenreSelect(item)}
              >
                <Text>{item.name}</Text>
              </GenreItem>
            )}
            ListEmptyComponent={<Text>No genres available</Text>}
          />
        </BottomSheetContainer>
      </BottomSheet>
    </Container>
  );
};

export default Login;
