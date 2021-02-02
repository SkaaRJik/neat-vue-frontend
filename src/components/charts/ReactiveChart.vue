<template>
  <div :id="uuid"></div>
</template>

<script>
import Plotly from "plotly.js-dist";

export default {
  name: "ReactiveChart",
  props: { data: Array, layout: Object, uuid: String },
  data: function() {
    return {
      baseLayout: {
        plot_bgcolor: "#303030",
        paper_bgcolor: "#303030",
        font: {
          color: "#FFF"
        }
      }
    };
  },
  mounted() {
    Plotly.newPlot(this.uuid, this.data ? this.data : [], {
      ...this.baseLayout,
      ...this.layout
    });
  },
  watch: {
    data: function(newValue) {
      if (newValue) {
        Plotly.newPlot(this.uuid, newValue, {
          ...this.baseLayout,
          ...this.layout
        });
      }
    },
    layout: function(newValue) {
      Plotly.newPlot(this.uuid, newValue, {
        ...this.baseLayout,
        ...this.layout
      });
    }
  }
};
</script>

<style scoped></style>
