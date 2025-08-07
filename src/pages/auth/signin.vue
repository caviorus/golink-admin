<script setup lang="ts">
import * as z from "zod";
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "@/utils/api";
import { useAuth } from "@/stores/auth";

const router = useRouter();
const toast = useToast();
const submitOnProcess = ref(false);

// Simulasi cookie dengan localStorage
const token = ref<string | null>(localStorage.getItem("token"));

onMounted(() => {
  if (token.value && token.value.length > 0) {
    router.push("/");
  }
});

const schema = z.object({
  username: z.string(),
  password: z.string().min(8, "Must be at least 8 characters"),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  username: undefined,
  password: undefined,
});

async function onSubmit(event: Event) {
  event.preventDefault();

  const result = schema.safeParse(state);
  if (!result.success) {
    toast.add({
      title: "Error",
      description:
        "Username and password are required, and password must be at least 8 characters.",
      color: "error",
    });
    return;
  }

  submitOnProcess.value = true;
  api
    .post("/signin", {
      username: state.username,
      password: state.password,
    })
    .then((response) => {
      if (response.data.token) {
        useAuth().setToken(response.data.token);
        token.value = response.data.token;
        router.push("/");
      } else {
        toast.add({
          title: "Error",
          description: "Login failed, please try again.",
          color: "error",
        });
      }
    })
    .catch((error) => {
      console.error(error);
      toast.add({
        title: "Error",
        description: "An error occurred during login.",
        color: "error",
      });
    })
    .finally(() => {
      submitOnProcess.value = false;
    });
}
</script>

<template>
  <div class="h-screen flex items-center justify-center">
    <div
      class="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md w-full max-w-md"
    >
      <h1 class="text-2xl font-bold mb-4">Sign In</h1>
      <form @submit="onSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Username</label>
          <input
            v-model="state.username"
            type="text"
            class="w-full border dark:border-slate-700 p-2 rounded"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Password</label>
          <input
            v-model="state.password"
            type="password"
            class="w-full border dark:border-slate-700 p-2 rounded"
          />
        </div>

        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded"
          :disabled="submitOnProcess"
        >
          {{ submitOnProcess ? "Submitting..." : "Submit" }}
        </button>
      </form>
    </div>
  </div>
</template>
