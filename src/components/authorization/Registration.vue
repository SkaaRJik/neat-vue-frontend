<template>
  <v-card>
    <v-card-title> </v-card-title>
    <v-card-text>
      <v-form v-model="valid" ref="form">
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field
                :label="$t('Email') + ' *'"
                required
                v-model="userDetails.email"
                :rules="emailRules"
                :error="!!emailError"
                :error-messages="emailError"
                @input="onEmailInput"
              >
              </v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                :rules="usernameRules"
                :label="$t('Login') + ' *'"
                required
                v-model="userDetails.username"
                :error="!!usernameError"
                :error-messages="usernameError"
                @input="onUsernameInput"
              >
              </v-text-field>
            </v-flex>
            <v-flex sm6 xs12>
              <v-text-field
                :label="$t('Password') + ' *'"
                :rules="passwordRules"
                required
                type="password"
                v-model="userDetails.password"
              ></v-text-field>
            </v-flex>
            <v-flex sm6 xs12>
              <v-text-field
                :label="$t('Password_Repeat') + ' *'"
                :rules="repeatPasswordRules"
                required
                type="password"
                v-model="repeatPassword"
              >
              </v-text-field>
            </v-flex>
            <v-flex sm6 xs12>
              <v-text-field
                :label="$t('First_Name') + ' *'"
                :rules="firstNameRules"
                required
                v-model="userDetails.firstName"
              ></v-text-field>
            </v-flex>
            <v-flex sm6 xs12>
              <v-text-field
                :label="$t('Last_Name') + ' *'"
                :rules="lastNameRules"
                required
                v-model="userDetails.lastName"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
      </v-form>
      <small>{{ $t("*_Is_Required") }}</small>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        @click="signUp"
        color="blue darken-1"
        text
        :disabled="!valid || isLoading"
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
  name: "Registration",
  props: {
    onSuccess: Function
  },
  data: () => ({
    valid: false,
    isLoading: false,
    repeatPassword: "",
    alert: {
      type: "error",
      message: "",
      timer: null
    },
    userDetails: {
      email: "",
      username: "",
      password: "",
      firstName: "",
      lastName: ""
    },
    emailError: "",
    emailTimeout: null,
    usernameTimeout: null,
    usernameError: "",
    emailExists: false,
    usernameRules: [],
    emailRules: [],
    passwordRules: [],
    repeatPasswordRules: [],
    firstNameRules: [],
    lastNameRules: []
  }),
  methods: {
    async signUp() {
      this.$refs.form.validate();
      this.isLoading = true;
      try {
        await this.checkIsEmailExist();
        await this.checkIsUsernameExist();
        if (this.valid) {
          const userDetailsCopy = {
            ...this.userDetails
          };
          const message = await this.$store.dispatch(
            "auth/REGISTER",
            userDetailsCopy
          );
          this.$toast.open({
            message: message,
            type: "success"
            // all of other options may go here
          });
          this.$emit("onSuccess");
        }
      } catch (e) {
        this.$toast.open({
          message: e,
          type: "error"
        });
      } finally {
        this.isLoading = false;
      }
    },
    onEmailInput() {
      if (this.emailTimeout) {
        clearTimeout(this.emailTimeout);
      }
      this.emailTimeout = setTimeout(async () => {
        await this.checkIsEmailExist();
      }, 500);
    },
    onUsernameInput() {
      if (this.usernameTimeout) {
        clearTimeout(this.usernameTimeout);
      }
      this.usernameTimeout = setTimeout(async () => {
        await this.checkIsUsernameExist();
      }, 500);
    },
    async checkIsEmailExist() {
      this.emailError = "";
      if (isEmailValid(this.userDetails.email)) {
        const emailExists = await isEmailExist(this.userDetails.email);
        if (emailExists === true) {
          this.emailError = this.$t("Email_Already_Taken_Info");
          this.valid = false;
        } else {
          this.valid = this.valid && true;
        }
      }
    },
    async checkIsUsernameExist() {
      this.usernameError = "";
      if (isUsernameValid(this.userDetails.username)) {
        const usernameExist = await isUsernameExist(this.userDetails.username);
        if (usernameExist === true) {
          this.usernameError = this.$t("Login_Already_Taken_Info");
          this.valid = false;
        } else {
          this.valid = this.valid && true;
        }
      }
    }
  },
  computed: {},
  created() {
    this.usernameRules = [
      v => !!v || this.$t("Fill_Field", { field: this.$t("Login") }),
      v => isUsernameValid(v) || this.$t("ERROR_Login_Is_Not_Valid")
    ];
    this.emailRules = [
      v => !!v || this.$t("Fill_Field", { field: this.$t("Email") }),
      v => isEmailValid(v) || this.$t("ERROR_Email_Is_Not_Valid")
    ];
    this.passwordRules = [
      v => !!v || this.$t("Fill_Field", { field: this.$t("Password") })
    ];
    this.repeatPasswordRules = [
      v => !!v || this.$t("Fill_Field", { field: this.$t("Password_Repeat") }),
      v => v === this.userDetails.password || this.$t("Passwords_Mismatch")
    ];
    this.firstNameRules = [
      v => !!v || this.$t("Fill_Field", { field: this.$t("First_Name") })
    ];
    this.lastNameRules = [
      v => !!v || this.$t("Fill_Field", { field: this.$t("Last_Name") })
    ];
  }
};
</script>

<style scoped></style>
