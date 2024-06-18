import axiosApiInstance from '../utils/AxiosConfig';

// Endpoints
const trendingMoviesEndpoint = `/trending/movie/day`;
const upcomingMoviesEndpoint = `/movie/upcoming`;
const topRatedMoviesEndpoint = `/movie/top_rated`;

// Dynamic endpoints
const movieDetailsEndpoint = (id) => `/movie/${id}`;
const movieCreditsEndpoint = (id) => `/movie/${id}/credits`;
const movieSimilarEndpoint = (id) => `/movie/${id}/similar`;

// Search endpoint
const searchMoviesEndpoint = `/search/movie`;

// Person endpoints
const personDetailEndpoint = (id) => `/person/${id}`;
const personMoviesEndpoint = (id) => `/person/${id}/movie_credits`;

// Image URLs
export const image500 = (path) => path ? `https://image.tmdb.org/t/p/w500/${path}` : null;
export const image342 = (path) => path ? `https://image.tmdb.org/t/p/w342/${path}` : null;
export const image185 = (path) => path ? `https://image.tmdb.org/t/p/w185/${path}` : null;

// API call function
const apiCall = async (endpoint, params = {}) => {
    try {
        const response = await axiosApiInstance.get(endpoint, {
            params: {
                ...params,
            },
        });

        return response.data;
    } catch (err) {
        console.error("Error:", err);
        return {};
    }
};

// Fetch functions for specific endpoints
export const fetchTrendingMovies = () => apiCall(trendingMoviesEndpoint);
export const fetchUpcomingMovies = () => apiCall(upcomingMoviesEndpoint);
export const fetchTopRatedMovies = () => apiCall(topRatedMoviesEndpoint);

// Fetch functions for dynamic endpoints
export const fetchMovieDetails = (id) => apiCall(movieDetailsEndpoint(id));
export const fetchMovieCredits = (id) => apiCall(movieCreditsEndpoint(id));
export const fetchSimilarMovies = (id) => apiCall(movieSimilarEndpoint(id));

// Fetch functions for person endpoints
export const fetchPersonDetails = (id) => apiCall(personDetailEndpoint(id));
export const fetchPersonMovies = (id) => apiCall(personMoviesEndpoint(id));

// Search movies
export const searchMovies = (params) => apiCall(searchMoviesEndpoint, params);
