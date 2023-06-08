import { writable } from "svelte/store";

type StreamingTypes = {
    addon: boolean;
    buy: boolean;
    free: boolean;
    rent: boolean;
    subscription: boolean;
};

type Addon = {
    id: string;
    displayName: string;
    homePage: string;
    themeColorCode: string;
    image: string;
};

type Country = {
    supportedStreamingTypes: StreamingTypes;
    addOns: Addon[];
};

type Service = {
    service: {
        id: string;
        countries: Country[];
    };
};






const services = writable<Service[]>();
const currentService = writable(null);
const availableCountries = writable<Country[]>(null);
const selectedCountry = writable<Country>(null);
export { services, currentService, availableCountries, selectedCountry };
export type { Service };
