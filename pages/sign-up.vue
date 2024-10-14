<script setup lang="ts">
import { z } from 'zod'
import type { FormError, FormSubmitEvent } from '#ui/types'

const schema = z.object({
  email: z.string().email('邮箱不合法'),
  password: z.string().min(8, '密码长度至少 8 位'),
  confirmPassword: z.string().min(8, '密码长度至少 8 位')
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  email: undefined,
  password: undefined,
  confirmPassword: undefined
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
  if (!state.confirmPassword){
    errors.push({ name: 'confirmPassword', message: '再次输入密码不能为空' })
  }
  return errors
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({ title: '注册成功', color: 'success' })
  console.log(event.data)
}
</script>

<template>
  <div class="w-screen h-screen flex flex-col justify-center items-center">
    <div class="text-xl font-bold text-center mb-8">注册账号</div>
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

      <UFormField label="再次确认密码" name="confirmPassword">
        <UInput v-model="state.confirmPassword" type="password" size="xl" />
      </UFormField>
      <UButton type="submit" size="xl">
        注册
      </UButton>
      <div className="w-full flex justify-between mb-40">
        <ULink href="/sign-in" class="text-sm">已有账号，去登录</ULink>
        <ULink class="text-sm">忘记密码</ULink>
      </div>
    </UForm>
  </div>
</template>