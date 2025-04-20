<template>
  <v-container fluid class="fill-height d-flex align-center justify-center">
    <v-row
      class="ma-0 pa-0"
      align="center"
      justify="center"
      style="width: 800px; max-width: 90%"
    >
      <v-col cols="12" md="6" class="pa-0">
        <v-img
          src="https://via.placeholder.com/400x400"
          alt="로그인 이미지"
          height="100%"
          cover
          class="rounded-l-lg"
        />
      </v-col>

      <v-col cols="12" md="6" class="pa-0">
        <v-card class="pa-8 rounded-r-lg" elevation="2">
          <v-card-title class="text-h5 text-center mb-6">로그인</v-card-title>

          <v-form fast-fail @submit.prevent="onLogin">
            <v-text-field
              v-model="username"
              label="아이디"
              prepend-inner-icon="mdi-account"
              outlined
              dense
              required
              :rules="usernameRules"
            />
            <v-text-field
              v-model="password"
              label="비밀번호"
              type="password"
              prepend-inner-icon="mdi-lock"
              outlined
              dense
              required
            />
            <v-btn type="submit" color="primary" block class="mt-4"
              >로그인</v-btn
            >
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const username = ref("");
const usernameRules = [
  (value: string[]) => {
    if (value.length >= 3) return true;
    return "username must be at leat 3 characters";
  },
];
const password = ref("");

const onLogin = () => {
  const response = await 
};
</script>
