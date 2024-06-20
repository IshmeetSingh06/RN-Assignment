import React, { useEffect, useState } from 'react';
import { Dimensions, View } from 'react-native';
import styled from 'styled-components/native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import Cast from '../components/Cast';
import MovieList from '../components/MovieList';
import Loading from '../components/Loading';
import { fetchMovieCredits, fetchMovieDetails, fetchSimilarMovies, image500 } from '../apis/movies';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const Container = styled.ScrollView`
  flex: 1;
  background-color: black;
`;

const Header = styled.View`
  width: 100%;
  position: relative;
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

const BackButton = styled.TouchableOpacity`
  padding: 8px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 9999px;
`;

const MovieImage = styled.Image`
  width: ${width}px;
  height: ${height * 0.55}px;
`;

const MovieDetails = styled.View`
  margin-top: ${-height * 0.20}px;
  padding: 20px;
`;

const MovieTitle = styled.Text`
  color: #fff;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
`;

const Subtitle = styled.Text`
  color: #9ca3af; 
  font-size: 14px;
  font-weight: 600;
  text-align: center;
`;

const GenresContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin: 10px 0;
`;

const GenreText = styled.Text`
  color: #9ca3af;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
`;

const Description = styled.Text`
  color: #9ca3af;
  font-size: 16px;
  line-height: 24px;
  margin-top: 10px;
  text-align: justify;
`;

const GradientOverlay = styled(LinearGradient)`
  position: absolute;
  width: 100%;
  height: ${height * 0.65}px; 
`;

const Movie = () => {
  const { params: item } = useRoute();
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [movie, setMovie] = useState({});
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await getMovieDetails(item.id);
      await getMovieCredits(item.id);
      await getSimilarMovies(item.id);
      setLoading(false);
    };

    fetchData();
  }, [item]);

  const getMovieDetails = async (id) => {
    const data = await fetchMovieDetails(id);
    if (data) setMovie(data);
  };

  const getMovieCredits = async (id) => {
    const data = await fetchMovieCredits(id);
    if (data && data.cast) setCast(data.cast);
  };

  const getSimilarMovies = async (id) => {
    const data = await fetchSimilarMovies(id);
    if (data && data.results) setSimilarMovies(data.results);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Container contentContainerStyle={{ paddingBottom: 20 }}>
      <Header>
        <View>
          <MovieImage source={{ uri: image500(movie?.poster_path) }} />
          {/* <GradientOverlay
            colors={['transparent', 'rgba(23, 23, 23, 0.8)', 'rgba(23, 23, 23, 1)', 'black']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          /> */}
        </View>

        <HeaderTop>
          <BackButton onPress={() => navigation.goBack()}>
            <ChevronLeftIcon size={28} strokeWidth={2.5} color="#fff" />
          </BackButton>
        </HeaderTop>
      </Header>

      <MovieDetails>
        <MovieTitle>{movie?.title}</MovieTitle>
        <Subtitle>
          {movie?.status} • {movie?.release_date?.split('-')[0] || 'N/A'} • {movie?.runtime} min
        </Subtitle>
        <GenresContainer>
          {movie?.genres?.map((genre, index) => (
            <GenreText key={index}>
              {genre?.name}
              {index + 1 !== movie.genres.length ? ' • ' : null}
            </GenreText>
          ))}
        </GenresContainer>
        <Description>{movie?.overview}</Description>
      </MovieDetails>

      {cast.length > 0 && <Cast cast={cast} />}
      {similarMovies.length > 0 && <MovieList title="Similar Movies" data={similarMovies} />}
    </Container>
  );
};

export default Movie;
