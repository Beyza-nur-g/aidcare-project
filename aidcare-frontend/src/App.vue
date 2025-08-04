<template>
  <div id="app">
    <nav class="main-nav">
      <router-link to="/" class="main-nav-link">🏠 Hastalar</router-link>
      <router-link to="/chart" class="main-nav-link"
        >📈 Şeker Ölçümü</router-link
      >
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
body {
  margin: 0;
  background-color: #f0f4f8;
  font-family: "Segoe UI", sans-serif;
}

.main-nav {
  background: #ffffff;
  padding: 1rem 2rem;
  display: flex;
  justify-content: center;
  gap: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-bottom: 2px solid #e0f2f1;
}

.main-nav-link {
  text-decoration: none;
  color: #4db6ac;
  font-weight: 600;
  font-size: 1.1rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.main-nav-link:hover {
  background-color: #e0f2f1;
  color: #00796b;
}

.main-nav-link.router-link-active {
  background-color: #4db6ac;
  color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
