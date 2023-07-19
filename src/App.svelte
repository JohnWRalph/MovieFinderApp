<script lang="ts">
  import Router from "svelte-spa-router";
  import Home from "./pages/Home.svelte";
  import WhereToGet from "./pages/WhereToGet.svelte";
    import Service from "./pages/Service.svelte";
  const routes = {
    "/": Home,
    "/wheretoget": WhereToGet,
    "/services": Service,
  };
  console.log(import.meta.env.VITE_SEARCH_KEY);
    console.log(import.meta.env.VITE_SEARCH_HOST);
</script>

<main>
  <Router {routes} />
</main>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
