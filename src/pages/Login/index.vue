<template>
  <v-container class="fill-height d-flex align-center justify-center" fluid>
    <v-row align="center" class="ma-0 pa-0" justify="center" style="width: 800px; max-width: 90%">
      <v-col class="pa-0" cols="12" md="6">
        <v-img
          alt="로그인 이미지"
          class="rounded-l-lg"
          cover
          height="100%"
          src="https://via.placeholder.com/400x400"
        />
      </v-col>

      <v-col class="pa-0" cols="12" md="6">
        <v-card class="pa-8 rounded-r-lg" elevation="2">
          <v-card-title class="text-h5 text-center mb-6">로그인</v-card-title>

          <v-form fast-fail @submit.prevent="onLogin">
            <v-text-field
              v-model="username"
              dense
              label="아이디"
              outlined
              prepend-inner-icon="mdi-account"
              required
              :rules="usernameRules"
            />
            <v-text-field
              v-model="password"
              dense
              label="비밀번호"
              outlined
              prepend-inner-icon="mdi-lock"
              required
              type="password"
            />
            <v-btn block class="mt-4" color="primary" type="submit">로그인</v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>

  import { ref } from 'vue';
  const username = ref('');
  const password = ref('');

  const usernameRules = [
    (value: string[]) => {
      if (value.length >= 3) return true;
      return 'username must be at leat 3 characters';
    },
  ];

  const onLogin = async () => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.value,
          password: password.value,
        }),
      })

      const result = await response.json()
      if (response.ok) {
        alert(result?.message || '로그인 성공')
      // 토큰 저장 예: localStorage.setItem('token', result.token)
      } else {
        alert(result.message|| '로그인 실패')
        console.error('로그인 실패:', result.message)
      }
    } catch (err) {
      console.error('요청 오류:', err)
    }
  }

</script>
