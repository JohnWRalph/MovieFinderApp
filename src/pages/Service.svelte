<script lang="ts">
    import axios from "axios";
    import {
        availableCountries,
        currentService,
        services,
    } from "../store/services";
    import { onMount } from "svelte";
    import { push } from "svelte-spa-router";
   
    async function getServices() {
     
        const options = {
            method: "GET",
            url: "https://streaming-availability.p.rapidapi.com/v2/services",
            headers: {
                "X-RapidAPI-Key": import.meta.env.VITE_SEARCH_KEY,
                "X-RapidAPI-Host": import.meta.env.VITE_SEARCH_HOST,
            },
        };

        try {

            const response = await axios.request(options);
            const result = response.data.result;
         
            const sortedServices = Object.entries(result).map(
                ([id, service]) => ({
                    id,
                    service,
                })
            );
            services.set(sortedServices);
        
        } catch (error) {
            console.error(error);
        }
        
    }

    getServices();
  

    let countryOptions = [];

    function getCountryOptions(country) {
  
        countryOptions = Object.keys(
            $currentService.service.countries[country].supportedStreamingTypes
        ).map((key) => ({
            key,
            value: $currentService.service.countries[country]
                .supportedStreamingTypes[key],
        }));

        return countryOptions;
    }

    function getServiceDetails(index) {
        countryOptions = [];
      
        currentService.set($services[index]);
  
        const sortedCountries = Object.entries(
            $services[index].service.countries
        ).map(([id, country]) => ({
            id,
            country,
        }));
      
        availableCountries.set(sortedCountries);
    }
    let selectedCountry;

    function scrollToBottom() {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "smooth",
        });
    }
</script>

{#if $services && $services.length}
    <button class="btn btn-secondary" on:click={() => push("/")}>Home</button>
    <br />
    <h1>Select a service for additional information</h1>
  

    <div class="services">
        {#each $services as service, i}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div
                on:click={() => getServiceDetails(i)}
                on:click={() => scrollToBottom()}
                class="serviceCard"
            >
                <img
                    class="serviceImage"
                    src="/{service.service.id}.svg"
                    alt={service.service.id}
                />
                <br />

                <br />
            </div>
        {/each}
    </div>
{/if}

{#if $availableCountries}
    <h1>Select A Country:</h1>
    <div class="availableCountries">
        {#each $availableCountries as country}
            <div class="flex flex-col items-center justify-center">
                <label
                    on:click={() => getCountryOptions(country.id)}
                    on:click={() => scrollToBottom()}
                    tabindex="0"
                    class="btn m-1">{country.id}</label
                >
            </div>
        {/each}
    </div>
{/if}

{#if countryOptions.length}
    <div class="countryOptions">
        <div class="overflow-x-auto">
            <table class="table table-zebra w-full">
                <!-- head -->
                <thead>
                    <tr>
                        <th />
                        <th>Purchase Options</th>
                        <th>Y/N</th>
                    </tr>
                </thead>

                <tbody class="tableBody">
                    {#each countryOptions as options, i}
                        <!-- row 1 -->
                        <tr>
                            <th />
                            {#if options.key === "addon"}
                                Steaming Addons
                            {:else if options.key === "buy"}
                                In App Purchases
                            {:else if options.key === "free"}
                                Free Streaming
                            {:else if options.key === "rent"}
                                In App Rentals
                            {:else if options.key === "subscription"}
                                Subscription
                            {/if}

                            {#if options.value}
                                <td>Y</td>
                            {:else}
                                <td>N</td>
                            {/if}
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
{/if}

<style global lang="postcss">
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    .availableCountries {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }

    .countryOptions {
        display: flex;
        flex-direction: column;
        justify-content: center;
        border: 1px solid black;
        border-radius: 20px;
    }

    .serviceImage {
        height: 100px;
        width: auto;
        border-radius: 20px;
    }
    .services {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }
    .serviceCard {
        height: 100px;
        width: 100px;
        margin: 10px;
        display: flex;
        justify-content: center;
        cursor: pointer;
        /* background-color: dimgrey; */
        /* border-radius: 20px; */
        /* border: 1px solid rgb(255, 255, 255); */
    }
</style>
