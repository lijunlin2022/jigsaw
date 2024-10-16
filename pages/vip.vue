<script setup lang="ts">
const services = ref([
  { label: '去除水印', icon: '' },
  { label: '高清下载', icon: '' },
  { label: '专属模板', icon: '' },
  { label: '更多高级功能', icon: '' },
])

const levels = ref([
  { label: '周会员', price: 10, qrCodeUrl: 'https://gstatic.clewm.net/caoliao-resource/231117/a44fa42f_4b16ec36_1666157560.png' },
  { label: '月会员', price: 30, qrCodeUrl: 'https://gstatic.clewm.net/caoliao-resource/231117/a44fa42f_4b16ec36_1666157560.png' },
  { label: '年会员', price: 300, qrCodeUrl: 'https://gstatic.clewm.net/caoliao-resource/231117/a44fa42f_4b16ec36_1666157560.png' }
])
</script>

<template>
  <div class="w-screen h-screen flex justify-center items-center">
    <UCard class="w-full max-w-xl">
      <template #header>
        <div class="text-xl font-bold text-center">加入会员</div>
      </template>
      <div class="mb-8">
        <div class="font-bold mb-4">会员专属功能</div>
        <UAccordion :items="services"></UAccordion>
      </div>
      <div>
        <div class="font-bold mb-8">微信扫码付款</div>
        <UTabs :items="levels" class="w-full">
          <template #content="{item}">
            <div class="flex flex-col justify-center items-center">
              <div class="text-2xl mt-6">{{item.price}}元</div>
              <img :src="item.qrCodeUrl" class="w-100 h-100" />
            </div>
          </template>
        </UTabs>
        <div class="text-sm text-center my-4">付款扫码如有问题，请联系客服，微信 xxx</div>
      </div>
    </UCard>
  </div>
</template>
