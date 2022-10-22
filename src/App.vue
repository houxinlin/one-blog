<template>
  <div id="nav">
    <router-link to="/"></router-link>
  </div>
  <router-view />
</template>

<style lang="less">
* {
  padding: 0px;
  margin: 0px;
}
li,
ul {
  list-style: none;
}

.avatar {
  width: 8rem;
  height: 8rem;
  border-radius: 50%;
  border: 4px solid #fff;
  box-shadow: 0 1px 4px #0000004d;
  object-fit: cover;
}

::-webkit-scrollbar {
    width: 10px;
  }

::-webkit-scrollbar-track {
    background: #6d1d1d00;
    border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #000000;
    border-radius: 10px;
  }

::-webkit-scrollbar-thumb:hover {
    background: rgb(100, 100, 100);
    border-radius: 10px;
  }

::-webkit-scrollbar-thumb:active {
    background: rgb(68, 68, 68);
    border-radius: 10px;
  }
</style>
