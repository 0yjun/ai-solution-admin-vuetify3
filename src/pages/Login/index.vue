<template>
  <v-container class="fill-height d-flex align-center justify-center" fluid>
    <v-row align="center" class="ma-0 pa-0" justify="center" style="width: 800px; max-width: 60%">
      <v-col class="pa-0" cols="12" md="6">
        <v-img
          alt="로그인 이미지"
          class="rounded-l-lg"
          cover
          height="100%"
          src="/src/assets/logo.png"
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
            <v-btn block class="mt-4" :disabled="authStore.isLoading" type="submit">
              {{ authStore.isLoading ? '로그인 중...' : '로그인' }}
            </v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>

  import { ref } from 'vue';
  import { useAuthStore } from '@/stores/auth';
  import { useRouter } from 'vue-router';

  const username = ref('');
  const password = ref('');
  const authStore = useAuthStore();
  const router = useRouter();

  const usernameRules = [
    (value: string[]) => {
      if (value.length >= 3) return true;
      return 'username must be at leat 3 characters';
    },
  ];

  const onLogin = async () => {
    const success = await authStore.login({
      username: username.value ,
      password: password.value,
    })
    if(success){
      router.push('/')
    }else{
      alert(authStore.errorMessage || '로그인에 실패하였습니다.')
    }
  }

</script>
