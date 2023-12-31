"use client";

import { useState, useEffect } from "react";
import { getCookie, setCookie } from "cookies-next";
import AddForm from "./AddForm";

export default function Admin() {
    const [admin_key, set_admin_key] = useState<string>("");
    const [authorized, set_authorized] = useState<boolean>(false);
    const [ready, set_ready] = useState<boolean>(false);
    const [reset_counter, set_reset_counter] = useState<number>(0);

    async function handle_validation_request(key: string) {
        if (!key) return;

        const { valid } = await fetch("/api/validate_admin_key", {
            method: "POST",
            body: JSON.stringify({ admin_key: key }),
        }).then((res) => res.json());

        if (valid) {
            setCookie("admin_key", key);
            set_authorized(true);
        }

        set_ready(true);
    }

    useEffect(() => {
        const cookie = getCookie("admin_key");
        if (cookie) {
            handle_validation_request(cookie);
        } else {
            set_ready(true);
        }
    }, []);

    if (ready && !authorized)
        return (
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    handle_validation_request(admin_key);
                }}
                className="w-full h-screen flex justify-center items-center flex-col"
            >
                <label htmlFor="admin_key" className="text-lg">
                    Infoga admin nyckeln
                </label>
                <div>
                    <input
                        type="password"
                        id="admin_key"
                        className="input-field m-2"
                        onChange={(event) => {
                            set_admin_key(event.target.value);
                        }}
                    />
                    <input type="submit" value="Validera" className="btn-primary" />
                </div>
            </form>
        );
    else if (authorized)
        return (
            <div>
                <AddForm key={reset_counter} reset={() => set_reset_counter(reset_counter + 1)} />
            </div>
        );
    else return <></>;
}
