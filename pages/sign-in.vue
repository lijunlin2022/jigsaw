<script setup lang="ts">
import { z } from 'zod'
import type { FormError, FormSubmitEvent } from '#ui/types'

const schema = z.object({
  email: z.string().email('邮箱不合法'),
  password: z.string().min(8, '密码长度至少 8 位')
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  email: undefined,
  password: undefined
})

const toast = useToast()

const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.email) {
    errors.push({ name: 'email', message: '邮箱不能为空' })
  }
  if (!state.password) {
    errors.push({ name: 'password', message: '密码不能为空' })
  }
  return errors
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  await signIn()
  toast.add({ title: '登录成功', color: 'success' })
}

async function signIn() {
  await useFetch('/api/user/sign-in', {
    method: 'post',
    body: state
  })
}
</script>

<template>
  <div class="w-screen h-screen flex flex-col justify-center items-center">
    <div class="text-xl font-bold text-center mb-8">登录</div>
    <UForm
      :validate="validate"
      :schema="schema"
      :state="state"
      @submit="onSubmit"
      class="space-y-4"
    >
      <UFormField label="邮箱" name="email">
        <UInput v-model="state.email" size="xl" />
      </UFormField>

      <UFormField label="密码" name="password">
        <UInput v-model="state.password" type="password" size="xl" />
      </UFormField>

      <UButton type="submit" size="xl">
        登录
      </UButton>

      <div className="w-full flex justify-between mb-40 ">
        <ULink href="/sign-up" class="text-sm">没有账号，去注册</ULink>
        <ULink class="text-sm">忘记密码</ULink>
      </div>
    </UForm>
  </div>
</template>