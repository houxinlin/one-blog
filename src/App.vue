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
</style>
