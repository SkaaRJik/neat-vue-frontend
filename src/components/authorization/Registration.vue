<template>
  <v-card>
    <v-card-title>
      <v-alert
        :type="alert.type"
        border="bottom"
        class="mb-0"
        dense
        elevation="2"
        style="width: 100%"
        transition="scale-transition"
        v-model="showAlert"
      >
        {{ alert.message }}
      </v-alert>
    </v-card-title>
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
                @input="checkIsEmailExist"
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
                @input="checkIsUsernameExist"
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
      <canvas
        id="avatar"
        width="200"
        height="200"
        style="border:1px solid #000000;"
      >
      </canvas>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="signUp" color="blue darken-1" text :disabled="!valid"
        >{{ $t("To_Sign_Up") }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import Ucavatar from "ucavatar";
import {
  isEmailValid,
  isUsernameValid,
  /*isUsernameExist,*/
  isEmailExist
} from "@/services/utils/validators";

function getImage(canvas) {
  const imageData = canvas.toDataURL();
  const image = new Image(200, 200);
  image.src = imageData;
  return imageData;
}

export default {
  name: "Registration",
  props: {
    onSuccess: Function
  },
  data: () => ({
    valid: false,
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
      await this.checkIsEmailExist();
      await this.checkIsUsernameExist();
      if (this.valid) {
        try {
          const userDetailsCopy = {
            ...this.userDetails,
            avatar: getImage(this.canvas)
          };
          await this.$store.dispatch("auth/register", userDetailsCopy);
          await this.$store.dispatch("ui/auth/SET_USER_DATA", userDetailsCopy);
          this.$emit("onSuccess");
        } catch (e) {
          console.error("[Registration].signUp() error:", e);
          this.alert.type = "error";
          this.alert.message = e.response ? e.response : e.message;
        }
      }
    },
    checkIsEmailExist() {
      if (this.emailTimeout) {
        clearTimeout(this.emailTimeout);
      }
      this.emailTimeout = setTimeout(async () => {
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
      }, 500);
    },
    async checkIsUsernameExist() {
      this.usernameError = null;
      if (isUsernameValid(this.userDetails.username)) {
        const usernameExist = await isEmailExist(this.userDetails.username);
        if (usernameExist === true) {
          this.usernameError = this.$t("Login_Already_Taken_Info");
          this.valid = false;
        } else {
          this.valid = this.valid && true;
        }
      }
    }
  },
  computed: {
    showAlert() {
      return !!this.alert.message;
    },
    canvas() {
      return document.querySelector("#avatar");
    }
  },
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
  },
  watch: {
    "userDetails.username": function(newVal) {
      Ucavatar.Ucavatar(this.canvas, newVal, 200);
    }
  }
};
</script>

<style scoped></style>
