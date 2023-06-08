import { writable } from "svelte/store";
type CurrentSelectionDataType = {
    advisedMinimumAudienceAge: number;
    backdropPath: string;
    backdropURLs: {
        300: string;
        780: string;
        1280: string;
        original: string;
    };
    cast: string[];
    countries: string[];
    directors: string[];
    genres: {
        // Your genre object structure is not provided, so you'll need to define the properties here
    }[];
    imdbId: string;
    imdbRating: number;
    imdbVoteCount: number;
    originalLanguage: string;
    originalTitle: string;
    overview: string;
    posterPath: string;
    posterURLs: {
        92: string;
        154: string;
        185: string;
        342: string;
        500: string;
        780: string;
        original: string;
    };
    runtime: number;
    streamingInfo: {
        us: {
            // Your streaming info structure for 'us' is not provided, so you'll need to define the properties here
        }
    };
    tagline: string;
    title: string;
    tmdbId: number;
    tmdbRating: number;
    type: string;
    year: number;
    youtubeTrailerVideoId: string;
    youtubeTrailerVideoLink: string;
};
const searchResults = writable([]);

const currentSelectionId = writable(null);
const currentSelectionData = writable<CurrentSelectionDataType>(null);
const streamingInfo = writable([]);
export { searchResults, currentSelectionId, currentSelectionData, streamingInfo };