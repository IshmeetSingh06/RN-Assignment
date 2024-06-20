import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Dimensions, FlatList } from 'react-native';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { XMarkIcon, FunnelIcon, ChevronLeftIcon } from 'react-native-heroicons/outline';
import { debounce } from 'lodash';
import { useNavigation } from '@react-navigation/native';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';

import Loading from '../components/Loading';
import { image185, searchMovies } from '../apis/movies';
import { getGenres } from '../apis/genre';

const { width, height } = Dimensions.get('window');

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: black;
`;

const HeaderTop = styled(SafeAreaView)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 20;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 16px;
`;

const SearchContainer = styled.View`
  flex: 1;
  margin-left: 10px;
  flex-direction: row;
  align-items: center;
  border: 1px solid #007aff;
  border-radius: 9999px;
  background-color: #1c1c1c;
  overflow: hidden;
  padding: 0 10px;
`;

const StyledTextInput = styled.TextInput`
  flex: 1;
  padding: 10px 16px 10px 10px;
  font-size: 16px;
  color: #fff;
`;

const BackButton = styled.TouchableOpacity`
  padding: 8px;
  background-color: #1c1c1c;
  border-radius: 9999px;
`;

const FilterButton = styled.TouchableOpacity`
  padding: 8px;
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

const BottomSheetContainer = styled.View`
  background-color: #2c2c2c; /* Light matte black */
  flex: 1;
  padding: 16px;
`;

const CloseButton = styled.TouchableOpacity`
  align-self: flex-end;
  padding: 8px;
`;

const CloseButtonText = styled.Text`
  color: #007aff;
  font-size: 16px;
  font-weight: bold;
`;

const GenreItem = styled.TouchableOpacity`
  flex: 1;
  padding: 10px;
  margin: 5px;
  background-color: ${(props) => (props.selected ? '#007aff' : props.disabled ? '#3c3c3c' : '#4c4c4c')}; /* Adjusted colors */
  border-radius: 5px;
  align-items: center;
`;

const GenreItemText = styled.Text`
  color: ${(props) => (props.selected ? '#fff' : '#ddd')}; /* Adjusted text color */
`;

const Search = () => {
    const navigation = useNavigation();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [genres, setGenres] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const bottomSheetRef = useRef(null);

    const handleSearch = useCallback(
        debounce(async (value, page = 1) => {
            if (value && value.length > 2) {
                setLoading(true);
                const genreIds = selectedGenres.map((genre) => genre.id);
                const data = await searchMoviesWithGenres({ query: value, genreIds, page });
                if (data && data.results) {
                    setResults((prevResults) => (page === 1 ? data.results : [...prevResults, ...data.results]));
                    setHasMore(data.page < data.total_pages);
                } else {
                    setHasMore(false);
                }
                setLoading(false);
            } else {
                setLoading(false);
                setResults([]);
            }
        }, 400),
        [selectedGenres]
    );

    const renderResult = ({ item }) => (
        <ResultItem onPress={() => navigation.push('Movie', item)}>
            <ResultImage source={{ uri: image185(item.poster_path) }} />
            <ResultTitle>
                {item?.title.length > 22 ? `${item?.title.slice(0, 22)}...` : item?.title}
            </ResultTitle>
        </ResultItem>
    );

    const handleGenreSelect = (genre) => {
        setSelectedGenres((prevGenres) => {
            if (prevGenres.some((g) => g.id === genre.id)) {
                return prevGenres.filter((g) => g.id !== genre.id);
            } else if (prevGenres.length < 5) {
                return [...prevGenres, genre];
            }
            return prevGenres;
        });
    };

    const handleLoadMore = () => {
        if (hasMore && !loading) {
            setPage((prevPage) => {
                const nextPage = prevPage + 1;
                handleSearch('', nextPage);
                return nextPage;
            });
        }
    };

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

    const bottomSheetSnapPoints = useMemo(() => [1, '85%'], []);

    return (
        <Container>
            <HeaderTop>
                <BackButton onPress={() => navigation.navigate('Dashboard')}>
                    <ChevronLeftIcon size={24} strokeWidth={2.5} color="#fff" />
                </BackButton>
                <SearchContainer>
                    <StyledTextInput
                        onChangeText={handleSearch}
                        placeholder="Search Movie"
                        placeholderTextColor="lightgray"
                    />
                    <FilterButton onPress={() => bottomSheetRef.current.expand()}>
                        <FunnelIcon color="#007aff" />
                    </FilterButton>
                </SearchContainer>
            </HeaderTop>

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
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={loading && <Loading />}
                    />
                </ResultsContainer>
            ) : (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#9ca3af', fontSize: 20 }}>Explore the world of cinema!</Text>
                </View>
            )}

            <BottomSheet
                ref={bottomSheetRef}
                snapPoints={bottomSheetSnapPoints}
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
                                disabled={!selectedGenres.some((g) => g.id === item.id) && selectedGenres.length >= 5}
                            >
                                <GenreItemText
                                    selected={selectedGenres.some((g) => g.id === item.id)}
                                    disabled={!selectedGenres.some((g) => g.id === item.id) && selectedGenres.length >= 5}
                                >
                                    {item.name}
                                </GenreItemText>
                            </GenreItem>
                        )}
                        ListEmptyComponent={<Text style={{ color: '#ddd' }}>No genres available</Text>}
                    />
                </BottomSheetContainer>
            </BottomSheet>
        </Container>
    );
};

export default Search;
