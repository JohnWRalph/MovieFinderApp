<script lang="ts">
    import axios from "axios";
    import {
        currentSelectionData,
        currentSelectionId,
        streamingInfo,
    } from "../store/searchResults";
    import { push } from "svelte-spa-router";
    import { currentService, selectedCountry } from "../store/services";
    import Service from "./Service.svelte";

    function getTitle() {
        const currentTitle = window.location.hash.slice(13);
        console.log(currentTitle);
       
        return currentTitle;
    }
    console.log($currentSelectionId);
    const currentTitle = getTitle();

    async function search() {
   

        const options = {
            method: "GET",
            url: "https://streaming-availability.p.rapidapi.com/v2/get/basic",
            params: {
                country: "us",
                imdb_id: $currentSelectionId,
                output_language: "en",
            },
            headers: {
                "X-RapidAPI-Key":
                    import.meta.env.VITE_SEARCH_KEY,
                "X-RapidAPI-Host": import.meta.env.VITE_SEARCH_HOST,
            },
        };

        try {
            const response = await axios.request(options);
            console.log(response.data.result.youtubeTrailerVideoLink);
            currentSelectionData.set(response.data.result);
            streamingInfo.set(
                Object.keys($currentSelectionData.streamingInfo).map((key) => ({
                    key,
                    value: $currentSelectionData.streamingInfo[key],
                }))
            );
            console.log($streamingInfo);
        } catch (error) {
            console.error(error);
        }
    }
    search();

    let countryOptions = [];

    function getCountryOptions(country) {
        selectedCountry.set(country);
        countryOptions = Object.keys(
            $currentSelectionData.streamingInfo[country]
        ).map((key) => ({
            key,
            value: $currentSelectionData.streamingInfo[country][key],
        }));
        console.log(countryOptions);
    }
</script>

<div class="details">
    <button class="btn btn-secondary" on:click={() => push("/")}>Home</button>

    {#if $currentSelectionData}
        <div class="bannerVideo">
            <iframe
                class="trailerVideo"
                src="https://www.youtube.com/embed/{$currentSelectionData.youtubeTrailerVideoId}"
                title="&quot;South Park: Post Covid&quot; Promo"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
            />
        </div>

        <div class="additonalDetails">
            <div class="bannerTitle">
                {$currentSelectionData.title} ({$currentSelectionData.year})
            </div>
            <div class="detailsTop">
                <img
                    class="detailsImage"
                    src={$currentSelectionData.posterURLs.original}
                    alt="no image found"
                />
                <div class="detailsInfo">
                    {$currentSelectionData.tagline}
                    <br />
                    {$currentSelectionData.overview}
                    <br />
                    Cast:
                    {$currentSelectionData.cast}
                    <br />
                    Directors:
                    {$currentSelectionData.directors}
                    <br />
                    Runtime:
                    {$currentSelectionData.runtime}
                    <br />
                    <div class="stats shadow">
                        <div class="stat">
                            <div class="stat-title">IMDB RATING</div>
                            <div class="stat-value">
                                <div
                                    class="radial-progress"
                                    style="--value:{$currentSelectionData.imdbRating};"
                                >
                                    {$currentSelectionData.imdbRating}
                                </div>
                            </div>
                        </div>

                        <div class="stat">
                            <div class="stat-title">IMDB VOTE COUNT</div>
                            <div class="stat-value">
                                {$currentSelectionData.imdbVoteCount}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bottomInformation" />
            Select A Country:
            <br>
            {#each $streamingInfo as country}
                <button
                    on:click={() => selectedCountry.set(country.key)}
                    on:click={() => getCountryOptions(country.key)}
                    class="btn btn-primary">{country.key}</button
                >
            {/each}
            <br />
            <div class="serviceContainer">
                {#if countryOptions}
                    {#each countryOptions as service}
                 

                        <div
                            class="serviceImage"
                            on:click={() => currentService.set(service)}
                        >
                            <img
                                src="src/assets/{service.key}.svg"
                                alt={service.key}
                            />
                        </div>
                    {/each}
                {/if}
            </div>

            {#if $currentService}
                {#each $currentService.value as option, i}
                    <div class="countryOptions">
                        <div class="overflow-x-hidden">
                            <table class="table table-zebra">
                                <!-- head -->
                                <thead>
                                    <tr>
                                        <th>Option {i + 1}</th>
                                        <th>
                                            {#if option.type === "addon"}
                                                Streaming Addon
                                            {:else if option.type === "buy"}
                                                In App Purchase
                                            {:else if option.type === "free"}
                                                Free Streaming
                                            {:else if option.type === "rent"}
                                                In App Rental
                                            {:else if option.type === "subscription"}
                                                Subscription
                                            {/if}
                                        </th>
                                    </tr>
                                </thead>

                                <tbody class="tableBody">
                                    <!-- row 1 -->

                                    <tr>
                                        <th>Price</th>
                                        {#if option.price}
                                            <th>{option.price.formatted}</th>
                                        {:else}
                                            <th>-</th>
                                        {/if}
                                    </tr>
                                    <tr>
                                        <th>Link</th>
                                        <th class="link">{option.link}</th>
                                        <th />
                                    </tr>
                                    <tr>
                                        <th>Quality</th>
                                        <th>{option.quality}</th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                {/each}
            {/if}
        </div>
    {/if}
</div>



<style global lang="postcss">
    @tailwind base;
    @tailwind components;
    @tailwind utilities;

    .bannerInfo {
        width: 95vw;
    }

    .bannerVideo{
        width:95vw;
        height:400px;
    }
    .bottomInformation{
        margin:10px;
    }
    .countryOptions{
        margin: 10px;
        border:1px solid black;
        border-radius: 10px;
    }
    .details {
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow-x: hidden;
        position: relative;
    }
    .detailsImage {
        height: 300px;
        margin:auto;
        margin-left:15px;
    }
    .detailsInfo{
        margin:auto;
    }
    .detailsTop {
        display: flex;
        flex-direction: row;
        row-gap: 5px;
        border:1px solid black;
        border-radius: 10px;
    }
    .serviceContainer{
        display: flex;
        flex-wrap: wrap;
        justify-content: center;


    }
    .serviceImage {
        height: 100px;
        width: 100px;
        margin: 10px;
        border-radius: 10px;
        background-color: rgb(116, 116, 116);
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    }
 
    .trailerVideo {
        height: 100%;
        width: 100%;
    } 
</style>
