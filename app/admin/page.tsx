"use client"

import { useState, FormEvent } from "react"

export default function Admin() {
    const [admin_key, set_admin_key] = useState<string>();
    const [authorized, set_authorized] = useState<boolean>(false);

    async function handle_validation_request(event?: FormEvent) {
        console.log("Submit", admin_key);
        event?.preventDefault();

        if (!admin_key) return;

        const { valid } = await fetch("/api/validate_admin_key", { method: "POST", body: JSON.stringify({ admin_key: admin_key }) }).then(res => res.json());

        if (valid) {
            console.log(valid);
            set_authorized(true);
        }
    }

    if (!authorized) return (
        <form onSubmit={handle_validation_request} className="w-full h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 flex justify-center items-center flex-col">
            <label htmlFor="admin_key" className="text-lg">Infoga admin nyckeln</label>
            <div>
                <input type="password" id="admin_key" className="input-field" onChange={(event) => { set_admin_key(event.target.value) }} />
                <input type="submit" value="Validera" className="btn-primary" />
            </div>
        </form>
    );
    else return (
        <div></div>
    )
}
