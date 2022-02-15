export default function({ store, redirect, route }) {
    if (store.state.user.userInfo && route.name === "login") {
        return redirect("/");
    }
}
