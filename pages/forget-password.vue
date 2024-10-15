<script setup lang="ts">
import { z } from 'zod'
import type { FormError, FormSubmitEvent } from '#ui/types'

const schema = z.object({
  email: z.string().email('邮箱不合法')
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  email: undefined
})

const toast = useToast()

const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.email) {
    errors.push({ name: 'email', message: '邮箱不能为空' })
  }
  return errors
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  await forgetPassword()
  toast.add({ title: '重置邮件发送成功', color: 'success' })
}

async function forgetPassword() {
  await useFetch('/api/user/forget-password', {
    method: 'post',
    body: state
  })
}
</script>

<template>
  <div class="w-screen h-screen flex flex-col justify-center items-center">
    <div class="text-xl font-bold text-center mb-8">重置密码</div>
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

      <UButton type="submit" size="xl">
        重置
      </UButton>

      <div className="w-full flex justify-between mb-40 ">
        <ULink href="/sign-up" class="text-sm">没有账号，去注册</ULink>
        <ULink href="/sign-in" class="text-sm">去登录</ULink>
      </div>
    </UForm>
  </div>
</template>