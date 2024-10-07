<template>
  <li :data-path="item.path">
    <span>{{ index + 1 }}. </span>{{ item.title }}
  </li>
</template>

<script>
export default {
  props: {
    item: {
      type: {
        id: String,
        path: String,
        title: String,
      },
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
};
</script>

<style scoped>
li {
  list-style-type: none;
  margin-left: 10px;
  cursor: default;
}

li:hover {
  background-color: #dddddd;
}
</style>
