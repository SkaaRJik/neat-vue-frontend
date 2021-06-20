<template>
  <div style="width: 100%;" :id="uuid"></div>
</template>

<script>
import Plotly from "plotly.js-dist";
import { uuidv4 } from "@/services/utils/generate.utils";

export default {
  name: "ReactiveChart",
  props: { data: Array, layout: Object },
  data: function() {
    return {
      uuid: uuidv4(),
      config: { responsive: true },
      baseLayout: {
        // plot_bgcolor: "#303030",
        // paper_bgcolor: "#303030",
        // font: {
        //   color: "#FFF"
        // }
      }
    };
  },
  methods: {
    createPlot(data, layout) {
      Plotly.newPlot(
        this.uuid,
        data ? data : [],
        {
          ...this.baseLayout,
          ...layout
        },
        this.config
      );
    }
  },
  mounted() {
    this.createPlot(this.data, this.layout);
  },
  watch: {
    data: function(newValue) {
      this.createPlot(newValue, this.layout);
    },
    layout: function(newValue) {
      this.createPlot(this.data, newValue || {});
    }
  }
};
</script>

<style scoped></style>
