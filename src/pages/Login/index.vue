<template>
  <v-container class="pa-0" fluid style="height: 100vh;">
    <!-- 뷰포트 전체 높이를 채우고 내용 중앙 정렬 -->
    <v-row align="center" justify="center" style="height: 100%;">
      <v-col cols="auto">
        <!-- 고정 너비 로그인 박스 -->
        <v-container style="width: 800px;">
          <v-row style="height: 350px;">
            <!-- 로고 + 타이틀 -->
            <v-col
              class="d-flex align-center justify-center"
              sm="5"
              style="background-color: #0b9b96;"
            >
              <v-row class="d-flex align-center">
                <v-col class="pr-1" sm="5">
                  <img
                    class="float-right"
                    height="30"
                    src="@/assets/logo.png"
                    width="30"
                  >
                </v-col>
                <v-col class="pl-2" sm="7">
                  <div
                    class="white--text font-weight-medium"
                    style="font-size:23px; letter-spacing:1px;"
                  >
                    AI Solution
                  </div>
                </v-col>
              </v-row>
            </v-col>

            <!-- 로그인 폼 -->
            <v-col class="pa-16" sm="7" style="background-color: #f1fafa;">
              <v-form ref="loginForm">
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="id.text"
                      append-icon="mdi-account"
                      dense
                      :label="id.label"
                      :maxlength="id.maxlength"
                      outlined
                      :placeholder="id.placeholder"
                      :rules="id.rules"
                      @keydown.enter="onLogin"
                    />
                  </v-col>
                </v-row>

                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="pw.text"
                      append-icon="mdi-lock"
                      autocomplete="off"
                      dense
                      :label="pw.label"
                      :maxlength="pw.maxlength"
                      outlined
                      :placeholder="pw.placeholder"
                      :rules="pw.rules"
                      type="password"
                      @keydown.enter="onLogin"
                    />
                  </v-col>
                </v-row>

                <v-row class="mt-4" justify="space-between">
                  <v-col class="text-left" cols="6">
                    <v-btn text @click="goSignup">
                      회원가입
                    </v-btn>
                  </v-col>
                  <v-col class="text-right" cols="6">
                    <v-btn elevation="0" tile @click="onLogin">
                      로그인
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>


<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { useAuthStore } from '@/stores';
  import { useRouter } from 'vue-router';

  const authStore = useAuthStore();
  const router = useRouter();
  const loginForm = ref();

  const id = reactive({
    text: '',
    label: '아이디',
    placeholder: '아이디를 입력하세요.',
    maxlength: 30,
    rules: [
      (v: string) => !!v || '아이디는 필수 입력사항입니다.',
      (v: string) => (v && v.length <= 30) || '아이디는 30자 이하로 입력해주세요.',
    ],
  });

  const pw = reactive({
    text: '',
    label: '패스워드',
    placeholder: '패스워드를 입력하세요.',
    maxlength: 50,
    rules: [
      (v: string) => !!v || '패스워드는 필수 입력사항입니다.',
      (v: string) => !/\s/.test(v) || '패스워드는 공백 없이 입력해주세요.',
      (v: string) => (v && v.length <= 50) || '패스워드는 50자 이하로 입력해주세요.',
    ],
  });

  const onLogin = async () => {
    const valid = await loginForm.value?.validate();
    if (!valid) return;

    const success = await authStore.login({
      username: id.text,
      password: pw.text,
    });

    if (success) {
      router.push('/');
    } else {
      alert(authStore.errorMessage || '로그인에 실패하였습니다.');
    }
  };

  const goSignup = () => {
    router.push('/signup');
  };
</script>
