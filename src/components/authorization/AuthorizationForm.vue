<template>
  <v-card>
    <v-card-title>
      <v-toolbar dense>
        <v-tabs centered slider-color="yellow" v-model="tab">
          <v-tab href="#sign-in">
            {{ $t("Sign_In") }}
          </v-tab>
          <v-tab href="#sign-up">
            {{ $t("Sign_Up") }}
          </v-tab>
        </v-tabs>
        <v-spacer></v-spacer>

        <v-btn @click="closeDialog" dark icon v-if="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
    </v-card-title>
    <v-card-text>
      <v-tabs-items v-model="tab">
        <v-tab-item value="sign-in">
          <Login></Login>
        </v-tab-item>
        <v-tab-item value="sign-up">
          <Registration v-on:onSuccess="setTab('sign-in')"></Registration>
        </v-tab-item>
      </v-tabs-items>
    </v-card-text>
  </v-card>
</template>

<script>
import Registration from "@/components/authorization/Registration";
import Login from "@/components/authorization/Login";
export default {
  name: "AuthorizationForm",
  components: {
    Login,
    Registration
  },
  props: {
    close: Function
  },
  data() {
    return {
      dialog: false,
      tab: "sign-in",
      dataToLogin: {
        username: "",
        password: "",
        message: ""
      },
      username: "1"
    };
  },
  methods: {
    closeDialog() {
      this.$emit("close");
    },
    setTab: tabName => () => {
      this.tab = tabName;
    }
  }
};
</script>

<style scoped></style>
