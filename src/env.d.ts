/// <reference types="astro/client" />

interface Env {
  DB: any; // Using any for local database operations to bypass wrangler types dependency
}

declare namespace App {
  interface Locals {
    runtime: {
      env: Env;
    };
  }
}
