<template>
  <v-container class="pa-0" fluid style="height: 100vh;">
    <v-row align="center" justify="center" style="height: 100%;">
      <v-col cols="auto">
        <v-container style="width: 800px;">
          <v-row style="height: 350px;">
            <!-- 로고 + 타이틀 (Login.vue와 동일) -->
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
                    회원가입
                  </div>
                </v-col>
              </v-row>
            </v-col>

            <!-- 회원가입 폼 -->
            <v-col class="pa-16" sm="7" style="background-color: #f1fafa;">
              <v-form ref="signupForm">
                <!-- 아이디 -->
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
                      @keydown.enter="onSignup"
                    />
                  </v-col>
                </v-row>

                <!-- 비밀번호 -->
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="pw.text"
                      append-icon="mdi-lock"
                      dense
                      :label="pw.label"
                      :maxlength="pw.maxlength"
                      outlined
                      :placeholder="pw.placeholder"
                      :rules="pw.rules"
                      type="password"
                      @keydown.enter="onSignup"
                    />
                  </v-col>
                </v-row>

                <!-- 권한 콤보박스 -->
                <v-row>
                  <v-col>
                    <Combo
                      ref="roleRef"
                      v-model="selectedRole"
                      fetch-url="/api/constants/roles"
                      hide-detail
                      item-label="label"
                      item-value="value"
                      label="권한등급"
                      :rules="[ v => !!v || '권한을 선택하세요.' ]"
                    />
                  </v-col>
                </v-row>

                <v-row class="mt-4" justify="space-between">
                  <v-col class="text-left" cols="6">
                    <v-btn text @click="goLogin">
                      로그인으로 돌아가기
                    </v-btn>
                  </v-col>
                  <v-col class="text-right" cols="6">
                    <v-btn elevation="0" tile @click="onSignup">
                      회원가입
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
  import Combo from '@/components/Combo.vue';

  const authStore = useAuthStore();
  const router = useRouter();
  const signupForm = ref();

  // reactive field definitions
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
  const selectedRole = ref<string | null>(null);

  const onSignup = async () => {
    const valid = await signupForm.value?.validate();
    if (!valid) return;

    // 예시: authStore.register 메서드가 있다고 가정
    const success = await authStore.signup({
      username: id.text,
      password: pw.text,
      role: selectedRole.value!,
    });

    if (success) {
      alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
      router.push('/login');
    } else {
      alert(authStore.errorMessage || '회원가입에 실패하였습니다.');
    }
  };

  const goLogin = () => {
    router.push('/login');
  };
</script>
