<template>
    <div class="flex-container">
        <div class="content-container nq-style scrollbar-themed">
            <div class="centered-container">
                <div class="text-center">
                    <div class="logo"></div>
                    <h1>Nimiq Wallet Manager</h1>
                </div>
                <div class="nq-card">

                    <div class="form">
                        <h2 class="nq-h2">Login</h2>
                        <form method="post">
                            <div class="nq-label">Username:</div>
                            <input type="text" name="username">
                            <div class="nq-label">Password:</div>
                            <input type="password" class="password" name="password">
                            <button class="nq-button-s">Login</button>
                        </form>
                        <a href="/register">No account? Register here</a>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data() {
            return {
                msg: "Welcome to Crypto Info"
            };
        },
        components: {

        }
    };
</script>
