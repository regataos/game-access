<template>
  <div id="game-access">
    <aside class="launchers-list">
      <img class="regata-logo" src="images/regataos.png">
      <p>Launchers Disponíveis</p>

      <ol>
        <li v-for="launcher in launchers" class="launcher">
          <RouterLink :to="launcher.iconName">
            <img :src="getIconPath(launcher.iconName)" :alt="launcher.name">
            <span>{{ launcher.name }}</span>
          </RouterLink>
        </li>
      </ol>
    </aside>

    <main>
      <nav>
        <ol>
          <li>
            <RouterLink to="/"><span>Game Access</span></RouterLink>
          </li>
          <!-- <li>
            <RouterLink to="/About"><span>Jogos Instalados</span></RouterLink>
          </li> -->
          <li>
            <RouterLink to="/About"><span>Todos os Jogos</span></RouterLink>
          </li>
          <li>
            <RouterLink to="/About"><span>Configurações</span></RouterLink>
          </li>
        </ol>
      </nav>

      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import launchers from "./jsons/launchers.json"

const getIconPath = (iconName: string) => {
  return new URL(`./assets/images/launcher-icons/${iconName}.png`, import.meta.url).href;
};
</script>

<style scoped lang="scss">
#game-access {
  display: grid;
  grid-template-columns: 245px auto;
  min-height: 100vh;

  aside,
  nav {
    background-color: rgba(4, 4, 4, 0.68);
  }

  aside {
    padding-top: 20px;
    padding-left: 10px;

    .regata-logo {
      margin-left: 20px;
      width: 50px;
    }

    p {
      font-size: 14px;
      font-weight: 300;
    }

    .launcher {
      margin: 20px 0;

      a {
        display: flex;
        align-content: center;
      }

      img {
        width: 35px;
        padding-right: 15px;
      }
    }
  }

  main {
    padding: 12px;

    nav {
      margin: -12px;
      padding: 12px;

      ol {
        margin: 0;
        display: flex;
        gap: 32px;
        text-transform: uppercase;
        font-family: 'Roboto', sans-serif;
        font-size: 15px;
      }
    }
  }
}
</style>