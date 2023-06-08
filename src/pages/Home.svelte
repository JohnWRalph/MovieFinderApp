<script lang="ts">
  import axios from "axios";
  import { push } from "svelte-spa-router";
  import { searchResults, currentSelectionId } from "../store/searchResults";


  let titleInput;
  let parsedTitle;


  async function search() {
    console.log(titleInput);
    parsedTitle = titleInput.replace(/ /g, "%20");
    const parsedInput = titleInput.replace(" ", "%20");
    const options = {
      method: "GET",
      url: "https://streaming-availability.p.rapidapi.com/v2/search/title",
      params: {
        title: parsedInput,
        country: "us",
        show_type: "movie",
        output_language: "en",
      },
      headers: {
        "X-RapidAPI-Key": import.meta.env.VITE_SEARCH_KEY,
        "X-RapidAPI-Host": import.meta.env.VITE_SEARCH_HOST,
      },
    };

    try {
      const response = await axios.request(options);
      // returnedResults = response.data.d;
      searchResults.set(response.data.result);
      console.log(response.data.result);
    } catch (error) {
      console.error(error);
    }
  }
</script>

<div class="hero ">
  <div class="hero-content text-center">
    <div class="max-w-lg">
      <h1 class="text-5xl font-bold">View Movie Streaming Availability</h1>
      <p class="py-6">
        Tired not not knowing where to your favorite movies?
        Search below and find them quickly!
      </p>
      <input
        bind:value={titleInput}
        type="text"
        placeholder="Enter Title"
        class="input input-bordered titleInput input-primary-focus w-full"
      />

      <button on:click={search} class="btn btn-primary titleInputSubmitButton"
        >Search</button
      >

      <div on:click={() => push("/services")} class="link">
        View Available Services and Additional Information
      </div>
    </div>
  </div>
</div>


{#if $searchResults && $searchResults.length}
  <div class="movieCardContainer">
    {#each $searchResults as result, index}
      <div
        on:click={() => currentSelectionId.set(result.imdbId)}
        on:click={() => push("/wheretoget")}
        class="movieCard"
      >
        <img src={result.posterURLs.original} alt={result.title} />
        <div class="movieInformation">
          {result.title}
        </div>
      </div>
    {/each}
  </div>
{/if}

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  .input {
    display: flex;
    flex-direction: row;
  }

  .movieCard {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    /* background-color: #fff; */
    border-radius: 0.5rem;
    box-shadow: 0 0 0 5px rgba(0, 0, 0, 0.25), 0 2px 4px 0 rgba(0, 0, 0, 0.1);
    padding: 1rem;
    margin: 1rem;
    width: 250px;
    height: 400px;
    cursor: pointer;
  }

  .movieCard:hover {
    transform: scale(1.1);
  }
  .movieCardContainer {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 20px;
  }

  .titleInput {
    width: 50%;
    margin-bottom: 5px;
    margin-top: 5px;
    margin-left: 50%;
    transform: translateX(-50%);
  }
  .titleInputSubmitButton {
    width: 50%;
  }
</style>
