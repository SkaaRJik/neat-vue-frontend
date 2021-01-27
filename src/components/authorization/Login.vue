<template>
  <v-card>
    <v-card-text>
      <v-form v-model="valid" ref="form">
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field
                :label="$t('Login_Or_Email')"
                required
                :rules="usernameRules"
                v-model="dataToLogin.username"
                :error="!!loginError"
                :error-messages="loginError"
                @input="checkUsernameWithTimeout"
              />
            </v-flex>
            <v-flex xs12>
              <v-text-field
                :label="$t('Password')"
                :rules="passwordRules"
                required
                type="password"
                v-model="dataToLogin.password"
              />
            </v-flex>
          </v-layout>
        </v-container>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        :disabled="isLoading || !valid"
        @click="signIn"
        color="blue darken-1"
        text
      >
        <v-progress-circular
          color="amber"
          indeterminate
          v-show="isLoading"
        ></v-progress-circular>
        <span v-show="!isLoading">{{ $t("To_Sign_In") }}</span>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import {
  isEmailExist,
  isEmailValid,
  isUsernameExist,
  isUsernameValid
} from "@/services/utils/validators";

export default {
  name: "Login",
  data() {
    return {
      valid: false,
      isLoading: false,
      loginError: "",
      dataToLogin: {
        username: "",
        password: ""
      },
      usernameRules: [],
      passwordRules: [],
      checkUsernameTimerId: null,
      unwatch$: undefined
    };
  },
  methods: {
    async signIn() {
      this.$refs.form.validate();
      this.isLoading = true;
      try {
        await this.checkIsUsernameExist();
        if (this.valid) {
          await this.$store.dispatch("auth/LOGIN", this.dataToLogin);
          await this.$router.push({ name: "projects" });
        }
      } catch (e) {
        let message = e;
        if (e.response) {
          if (e.response.status === 401) {
            message = this.$t("Wrong_Password_Or_Login_Error");
          } else {
            message = e.response.data;
          }
        } else {
          message = e;
        }
        this.$toast.open({
          message: message,
          type: "error"
        });
      } finally {
        this.isLoading = false;
      }
    },

    checkUsernameWithTimeout() {
      if (this.checkUsernameTimerId) {
        clearTimeout(this.checkUsernameTimerId);
      }
      this.checkUsernameTimerId = setTimeout(this.checkIsUsernameExist, 500);
    },

    async checkIsUsernameExist() {
      this.loginError = "";
      if (isUsernameValid(this.dataToLogin.username)) {
        const usernameExist = await isUsernameExist(this.dataToLogin.username);
        if (usernameExist === false) {
          this.valid = false;
          this.loginError = this.$t(
            "User_With_Such_Username_Does_Not_Exist_Info"
          );
        } else {
          this.valid = this.valid && true;
        }
      } else {
        if (isEmailValid(this.dataToLogin.username)) {
          const emailExists = await isEmailExist(this.dataToLogin.username);
          if (emailExists === false) {
            this.valid = false;
            this.loginError = this.$t(
              "User_With_Such_Email_Does_Not_Exist_Info"
            );
          } else {
            this.valid = this.valid && true;
          }
        } else {
          this.valid = false;
          this.loginError = this.$t("ERROR_Email_Is_Not_Valid");
        }
      }
    }
  },
  created() {
    this.usernameRules = [
      v => !!v || this.$t("Fill_Field", { field: this.$t("Login") }),
      v =>
        isUsernameValid(v) ||
        isEmailValid(v) ||
        (v.includes("@") && this.$t("ERROR_Email_Is_Not_Valid")) ||
        this.$t("ERROR_Login_Is_Not_Valid")
    ];
    this.passwordRules = [
      v => !!v || this.$t("Fill_Field", { field: this.$t("Password") })
    ];
  }
};
</script>

<style scoped></style>
