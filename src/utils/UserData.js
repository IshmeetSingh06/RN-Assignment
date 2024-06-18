import AsyncStorage from "@react-native-async-storage/async-storage";

export const getUserData = async () => {
    try {
        const storedUsername = await AsyncStorage.getItem('username');
        const storedGenres = await AsyncStorage.getItem('selectedGenres');

        return {
            storedUsername: storedUsername,
            storedGenres: storedGenres
        }
    } catch (error) {
        console.error('Error checking storage:', error);
        return null
    }
};