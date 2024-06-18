import axiosApiInstance from '../utils/AxiosConfig';

export const getGenres = async () => {
  try {
    const response = await axiosApiInstance.get("/genre/movie/list");
    return response.data?.genres;
  } catch (error) {
    console.error('Error fetching genres:', error);
    throw error
  }
};
