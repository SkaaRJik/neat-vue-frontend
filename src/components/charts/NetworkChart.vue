<template>
  <div id="mynetwork"></div>
</template>

<script>
import * as vis from "vis-network";

export default {
  name: "NetworkChart",
  props: {
    value: {
      neuronsLayers: [
        {
          id: Number,
          bias: Number,
          type: String,
          label: String,
          activationFunction: String
        }
      ],
      connections: [
        {
          toId: Number,
          fromId: Number,
          weight: Number,
          enabled: Boolean
        }
      ]
    }
  },
  data: () => {
    return {
      nodes: [],
      edges: [],
      network: null,
      container: "",
      options: {
        nodes: {
          scaling: {
            min: 16,
            max: 32
          }
        },
        edges: {
          arrows: {
            to: {
              enabled: true,
              type: "arrow"
            }
          }
        },
        layout: {
          hierarchical: {
            enabled: true,
            direction: "LR",
            sortMethod: "directed",
            parentCentralization: true,
            edgeMinimization: true,
            treeSpacing: 200,
            nodeSpacing: 250,
            levelSeparation: 200,
            blockShifting: true
          }
        },
        physics: {
          barnesHut: { gravitationalConstant: -30000 },
          stabilization: { iterations: 2500 }
        },
        groups: {
          hiddenLayer: {
            shape: "ellipse",
            color: "#FF9900", // orange
            widthConstraint: {
              minimum: 10,
              maximum: 200
            }
          },
          inputLayer: {
            shape: "ellipse",
            color: "#2B7CE9", // blue
            widthConstraint: {
              minimum: 10,
              maximum: 200
            }
          },
          outputLayer: {
            shape: "ellipse",
            color: "#109618", // green
            widthConstraint: {
              minimum: 10,
              maximum: 200
            }
          },
          label: {
            shape: "box",
            color: "transparent",
            widthConstraint: {
              minimum: 10,
              maximum: 200
            }
          }
        }
      },

      LENGTH_MAIN: 350,
      LENGTH_SERVER: 150,
      LENGTH_SUB: 50,
      WIDTH_SCALE: 6,
      GREEN: "green",
      RED: "#C5000B",
      ORANGE: "orange",
      GRAY: "gray",
      BLACK: "#2B1B17"
    };
  },
  mounted() {
    /*// Create a data table with nodes.
    this.nodes = [];

    // Create a data table with links.
    this.edges = [];
    //
    this.nodes.push({ id: 1, label: "192.168.0.1", group: "hiddenLayer", value: 10 });
    this.nodes.push({ id: 2, label: "192.168.0.2", group: "hiddenLayer", value: 8 });
    this.nodes.push({ id: 3, label: "192.168.0.3", group: "hiddenLayer", value: 6 });
    this.edges.push({
      from: 1,
      to: 2,
      length: this.LENGTH_MAIN,
      width: this.WIDTH_SCALE * 6,
      label: "0.71 mbps",
    });
    this.edges.push({
      from: 1,
      to: 3,
      length: this.LENGTH_MAIN,
      width: this.WIDTH_SCALE * 4,
      label: "0.55 mbps",
    });

    // // group around 2
    for (let i = 100; i <= 104; i++) {
      let value = 1;
      let width = this.WIDTH_SCALE * 2;
      let color = this.GRAY;
      let label = null;

      if (i === 103) {
        value = 5;
        width = 3;
      }
      if (i === 102) {
        color = this.RED;
        label = "error";
      }

      this.nodes.push({
        id: i,
        label: "192.168.0." + i,
        group: "inputLayer",
        value: value,
      });
      this.edges.push({
        from: 2,
        to: i,
        length: this.LENGTH_SUB,
        color: color,
        fontColor: color,
        width: width,
        label: label,
      });
    }
    this.nodes.push({
      id: 201,
      label: "192.168.0.201",
      group: "inputLayer",
      value: 1,
    });
    this.edges.push({
      from: 2,
      to: 201,
      length: this.LENGTH_SUB,
      color: this.GRAY,
      width: this.WIDTH_SCALE,
    });

    // group around 3
    this.nodes.push({
      id: 202,
      label: "192.168.0.202",
      group: "inputLayer",
      value: 4,
    });
    this.edges.push({
      from: 3,
      to: 202,
      length: this.LENGTH_SUB,
      color: this.GRAY,
      width: this.WIDTH_SCALE * 2,
    });
    for (let i = 230; i <= 231; i++) {
      this.nodes.push({
        id: i,
        label: "192.168.0." + i,
        group: "mobile",
        value: 2,
      });
      this.edges.push({
        from: 3,
        to: i,
        length: this.LENGTH_SUB,
        color: this.GRAY,
        fontColor: this.GRAY,
        width: this.WIDTH_SCALE,
      });
    }*/

    // create a network
    this.container = document.getElementById("mynetwork");
    console.log("[NetworkChart].mounted this.value:", this.value);
    this.transformData(
      this.value?.neuronsLayers || [],
      this.value?.connections || []
    );
    this.network = new vis.Network(
      this.container,
      this.graph_data,
      this.options
    );
  },
  methods: {
    transformData(neuronsLayers, connections) {
      const neurons = [];
      const edges = [];
      let stepX = 1;
      //let stepY = 0;
      // const mynetwork = document.getElementById("mynetwork");
      // const x = -mynetwork.clientWidth / 2 + 50;
      // const y = -mynetwork.clientHeight / 2 + 50;

      // let x = 70;
      //let y = 45;

      let freeId = -1;

      neuronsLayers?.forEach(layer => {
        layer.forEach(neuron => {
          freeId = Math.max(neuron.id, freeId);
        });
      });

      neuronsLayers?.forEach(layer => {
        //stepY = 1;
        stepX++;
        layer.forEach(neuron => {
          //stepY++;
          neurons.push({
            id: neuron.id,
            //          x: x * stepX,
            //y: y * stepY,
            label: neuron.activationFunction,
            group:
              neuron.type === "INPUT"
                ? "inputLayer"
                : neuron.type === "OUTPUT"
                ? "outputLayer"
                : "hiddenLayer",
            level: stepX,
            fixed: {
              x: true,
              y: false
            },
            title: `${neuron.bias.toFixed(3)}`,
            physics: true
          });
          if (neuron.type === "INPUT") {
            neurons.push({
              id: ++freeId,
              //       x: -200,
              //y: y * stepY,
              label: neuron.label,
              group: "label",
              level: stepX - 1,
              fixed: {
                x: true,
                y: false
              },
              physics: true
            });
            edges.push({
              color: "gray",
              from: freeId,
              to: neuron.id,
              length: this.LENGTH_MAIN,
              width: 1
            });
          }
          if (neuron.type === "OUTPUT") {
            neurons.push({
              id: ++freeId,
              //     x: x * (stepX + 1) + 150,
              //y: y * stepY,
              label: neuron.label,
              group: "label",
              level: stepX + 1,
              fixed: {
                x: true,
                y: false
              },
              physics: true
            });
            edges.push({
              color: "gray",
              from: neuron.id,
              to: freeId,
              length: this.LENGTH_MAIN,
              width: 1
            });
          }
        });
        stepX++;
      });

      connections.forEach(connection => {
        edges.push({
          from: connection.fromId,
          to: connection.toId,
          length: this.LENGTH_MAIN,
          width: this.WIDTH_SCALE * connection.weight,
          label: `${connection.weight.toFixed(3)}`
        });
      });

      this.edges = edges;
      this.nodes = neurons;
    }
  },
  computed: {
    graph_data() {
      return {
        nodes: this.nodes,
        edges: this.edges
      };
    }
  },
  watch: {
    value(newVal) {
      this.transformData(
        newVal?.neuronsLayers || [],
        newVal?.connections || []
      );
    }
  }
};
</script>

<style scoped>
#mynetwork {
  width: 100%;
  height: 400px;
  border: 1px solid lightgray;
}
</style>
