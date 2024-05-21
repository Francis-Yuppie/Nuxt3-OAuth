<script setup lang="ts">
// import { sign } from "crypto";

const isLoading = ref(false);
const name = ref("");
const email = ref("");
const password = ref("");

const { signIn } = useAuth();
const socialAction = async (action: string) => {
    isLoading.value = true

    await signIn(action, {redirect: false})
}

type VARIANT = "LOGIN" | "REGISTER";

const variant = ref<VARIANT>("LOGIN");

const toggleVariant = () => {
  if (variant.value === "REGISTER") {
    variant.value = "LOGIN";
  } else {
    variant.value = "REGISTER";
  }
};

const onSubmit = async () => {
  if (variant.value === "REGISTER") {
    try {
      isLoading.value = true;

      // const { data, error } =
      await $fetch("/api/auth/register", {
        method: "POST",
        body: {
          name: name.value,
          password: password.value,
          email: email.value,
        },
      });

      // if (error.value) {
      //   console.error(error.value);
      // }

      // if (data.value) {
      //   console.log("Succesfully Registered");
      // }
    } catch (error) {
      console.error(error);
    } finally {
      isLoading.value = false;
    }
  } else {
    try {
      isLoading.value = true;

      const result = await signIn("credentials", {
        password: password.value,
        email: email.value,
        redirect: false,
      });

      if (result?.ok && !result.error) {
        console.log("Succesfully Logged in");
      } else {
        console.log("error while loggin in");
      }
    } catch (error) {
      console.error(error);
    } finally {
      isLoading.value = false;
    }
  }
};


</script>

<template>
  <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
    <div class="px-4 shadow sm:rounded-lg bg-white-700 sm:px-10">
      <form class="space-y-6" @submit.prevent="onSubmit">
        <!-- input -->

        <Input
          :disabled="isLoading"
          required
          id="name"
          label="Name"
          name="name"
          v-model="name"
          type="text"
          v-if="variant === 'REGISTER'"
        />

        <Input
          :disabled="isLoading"
          required
          id="email"
          label="Email"
          name="email"
          v-model="email"
          type="email"
        />

        <Input
          :disabled="isLoading"
          required
          id="password"
          label="Password"
          name="password"
          v-model="password"
          type="password"
        />

        <div>
          <Button :disabled="isLoading" fullWidth type="submit">
            {{ variant === "LOGIN" ? "Sign In" : "Register" }}
          </Button>
        </div>
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="bg-slate-900 text-white px-2"> OR </span>
            </div>
          </div>
          <div class="mt-6 flex gap-2">
            <AuthSocialButton @click="socialAction('github')" icon="bi:github" />
            <AuthSocialButton @click="socialAction('google')" icon="bi:google" />
          </div>
        </div>
        <div class="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
          <div @click="toggleVariant">
            {{
              variant === "LOGIN"
                ? "New to Messanger ?"
                : "Already have an account ?"
            }}
          </div>
          <div @click="toggleVariant" class="underline cursor-pointer">
            {{ variant === "LOGIN" ? "Create an account" : "Login" }}
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
</style>