import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { MagnifyingGlassIcon } from 'react-native-heroicons/outline';

import MovieList from '../components/MovieList';
import Loading from '../components/Loading';

import { fetchMoviesByGenre, fetchTrendingMovies, fetchUpcomingMovies } from '../apis/movies';

import { getUserData } from '../utils/UserData';

const Container = styled.View`
  flex: 1;
  background-color: white;
`;

const Header = styled(SafeAreaView)`
  padding: 16px;
`;

const HeaderContent = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: black;
`;

const ScrollViewContainer = styled.ScrollView`
  padding-bottom: 10px;
`;

const UserInfoCard = styled.View`
  background-color: #f0e5ff;
  padding: 16px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
`;

const Username = styled.Text`
  font-size: 32px;
  font-weight: bold;
  color: #333;
`;

const FavoriteGenre = styled.Text`
  font-size: 18px;
  color: #666;
  margin-top: 8px;
`;

const GenreChipsContainer = styled.View`
  flex-wrap: wrap;
  flex-direction: row;
  margin-top: 8px;
`;

const GenreChip = styled.Text`
  background-color: #d3c4ff;
  padding: 6px 12px;
  border-radius: 20px;
  margin-right: 8px;
  margin-bottom: 8px;
`;

const Dashboard = () => {
  const [username, setUsername] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recommended, setRecommended] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { storedUsername, storedGenres } = await getUserData();

        if (storedUsername) {
          setUsername(storedUsername);
        }

        if (storedGenres) {
          setSelectedGenres(JSON.parse(storedGenres));
        }

        getUpcomingMovies();
        getTopRatedMovies();
        getYourRecommendations();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const getUpcomingMovies = async () => {
    const data = await fetchUpcomingMovies()
    if (data && data.results) setUpcoming(data.results)
    setLoading(false)
  }

  const getTopRatedMovies = async () => {
    const data = await fetchTrendingMovies()
    if (data && data.results) setTopRated(data.results)
    setLoading(false)
  }

  const getYourRecommendations = async () => {
    const genreIds = selectedGenres.map(genre => genre.id);
    const data = await fetchMoviesByGenre(genreIds)
    if (data && data.results) setRecommended(data.results)
    setLoading(false)
  }

  return (
    <Container>
      <UserInfoCard>
        <Username>{username}</Username>
        <FavoriteGenre>Favorite Genre</FavoriteGenre>
        <GenreChipsContainer>
          {selectedGenres.map((genre, index) => (
            <GenreChip key={index}>{genre?.name}</GenreChip>
          ))}
        </GenreChipsContainer>
      </UserInfoCard>

      <Header>
        <HeaderContent>
          <Title>Movies</Title>
          <TouchableOpacity onPress={() => navigation.navigate("Search")}>
            <MagnifyingGlassIcon size={28} color="black" />
          </TouchableOpacity>
        </HeaderContent>
      </Header>

      {loading ? (
        <Loading />
      ) : (
        <ScrollViewContainer showsVerticalScrollIndicator={false}>
          <MovieList title="Recommendations" data={recommended} />
          <MovieList title="Upcoming" data={upcoming} />
          <MovieList title="Top Rated" data={topRated} />
        </ScrollViewContainer>
      )}
    </Container>
  );
};

export default Dashboard;
