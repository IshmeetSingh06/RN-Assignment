import React, { useCallback, useState } from 'react';
import { View, Text, Dimensions, FlatList } from 'react-native';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { XMarkIcon } from 'react-native-heroicons/outline';
import { debounce } from 'lodash';
import { useNavigation } from '@react-navigation/native';

import Loading from '../components/Loading';

import { image185, searchMovies } from '../apis/movies';

const { width, height } = Dimensions.get('window');

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: black;
`;

const SearchContainer = styled.View`
  margin: 16px;
  padding: 0 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #007aff;
  border-radius: 9999px;
  background-color: #1c1c1c; /* Optional: Adds a background color for better visibility */
`;

const StyledTextInput = styled.TextInput`
  padding: 10px 16px;
  flex: 1;
  font-size: 16px;
  color: #fff;
`;

const ClearButton = styled.TouchableOpacity`
  padding: 8px;
  border-radius: 9999px;
  justify-content: center;
  align-items: center;
`;

const ResultsContainer = styled.View`
  padding: 0 16px;
  flex: 1;
`;

const ResultsText = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  margin-left: 4px;
  margin-top: 16px;
`;

const ResultItem = styled.TouchableOpacity`
  flex: 1;
  margin: 8px;
`;

const ResultImage = styled.Image`
  border-radius: 12px;
  width: ${width * 0.44}px;
  height: ${height * 0.3}px;
`;

const ResultTitle = styled.Text`
  color: #fff;
  font-size: 14px;
  margin-top: 4px;
  text-align: center;
`;

const Search = () => {
    const navigation = useNavigation();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = useCallback(
        debounce((value) => {
            if (value && value.length > 2) {
                setLoading(true);
                searchMovies({
                    query: value,
                    include_adult: 'false',
                    language: 'en-US',
                    page: '1',
                }).then((data) => {
                    if (data && data.results) setResults(data.results);
                    setLoading(false);
                });
            } else {
                setLoading(false);
                setResults([]);
            }
        }, 400),
        []
    );

    const renderResult = ({ item }) => (
        <ResultItem onPress={() => navigation.push('Movie', item)}>
            <ResultImage source={{ uri: image185(item.poster_path) }} />
            <ResultTitle>
                {item?.title.length > 22 ? `${item?.title.slice(0, 22)}...` : item?.title}
            </ResultTitle>
        </ResultItem>
    );

    return (
        <Container>
            <SearchContainer>
                <StyledTextInput
                    onChangeText={handleSearch}
                    placeholder="Search Movie"
                    placeholderTextColor="lightgray"
                />
                <ClearButton onPress={() => navigation.navigate('Dashboard')}>
                    <XMarkIcon size={24} color="#fff" />
                </ClearButton>
            </SearchContainer>

            {loading ? (
                <Loading />
            ) : results.length > 0 ? (
                <ResultsContainer>
                    <ResultsText>Results ({results.length})</ResultsText>
                    <FlatList
                        data={results}
                        renderItem={renderResult}
                        keyExtractor={(item) => item.id.toString()}
                        numColumns={2}
                        showsVerticalScrollIndicator={false}
                    />
                </ResultsContainer>
            ) : (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#9ca3af', fontSize: 20 }}>
                        Explore the world of cinema!
                    </Text>
                </View>
            )}
        </Container>
    );
};

export default Search;
